use super::*;

const ASS: &str = "\u{feff}[Script Info]
Title: test
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize
Style: Default,Arial,20

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.50,0:00:03.20,Default,芙莉蓮,0,0,0,,人類的壽命{\\i1}真的{\\i0}很短暫呢。
Comment: 0,0:00:02.00,0:00:04.00,Default,,0,0,0,,這是註解，不該出現
Dialogue: 0,0:00:05.00,0:00:07.00,Default,,0,0,0,,{\\an8\\pos(320,50)}第一行\\N第二行，有逗號, 也沒關係
Dialogue: 1,0:00:05.00,0:00:07.00,Default,,0,0,0,,{\\blur3}第一行\\N第二行，有逗號, 也沒關係
Dialogue: 0,0:00:08.00,0:00:09.00,Sign,,0,0,0,,{\\p1}m 0 0 l 100 0 100 100 0 100{\\p0}
Dialogue: 0,0:00:10.00,0:00:11.00,Default,,0,0,0,,那就\\h再去一次吧
Dialogue: 0,1:02:03.04,1:02:05.00,Default,,0,0,0,,{\\fad(200,200)}
Dialogue: 0,0:00:00.10,0:00:00.90,Default,,0,0,0,,最早的一句
";

#[test]
fn ass_keeps_dialogue_and_skips_comments() {
    let cues = parse_ass(ASS).unwrap();
    let texts: Vec<&str> = cues.iter().map(|c| c.text.as_str()).collect();
    assert_eq!(
        texts,
        [
            "最早的一句",
            "人類的壽命真的很短暫呢。",
            "第一行",
            "那就 再去一次吧"
        ]
    );
    assert!(!texts.iter().any(|t| t.contains("註解")));
}

/// 原文／譯文 follow the file's own lines: `\N` splits, the soft `\n` does not.
#[test]
fn ass_hard_breaks_split_text_from_translation() {
    let cues = parse_ass(ASS).unwrap();
    let split = cues.iter().find(|c| c.text == "第一行").unwrap();
    assert_eq!(
        split.translation.as_deref(),
        Some("第二行，有逗號, 也沒關係")
    );
    assert_eq!(cues[0].translation, None);

    let soft = "[Events]\nFormat: Start, End, Text\nDialogue: 0:00:01.00,0:00:02.00,おはよう\\n今日は\\N早安，今天\\N真早呢\n";
    let cue = &parse_ass(soft).unwrap()[0];
    assert_eq!(cue.text, "おはよう 今日は");
    assert_eq!(cue.translation.as_deref(), Some("早安，今天\n真早呢"));
}

#[test]
fn ass_times_are_centiseconds_and_cues_come_in_start_order() {
    let cues = parse_ass(ASS).unwrap();
    assert_eq!((cues[0].start_ms, cues[0].end_ms), (100, 900));
    assert_eq!((cues[1].start_ms, cues[1].end_ms), (1500, 3200));
    // `index` is the position in the file, so the earliest line keeps its late position.
    assert!(cues[0].index > cues[1].index);
}

#[test]
fn ass_repeated_layers_drawings_and_empty_lines_are_dropped() {
    let cues = parse_ass(ASS).unwrap();
    assert_eq!(
        cues.iter().filter(|c| c.text.starts_with("第一行")).count(),
        1
    );
    assert!(!cues.iter().any(|c| c.text.contains("m 0 0")));
    assert!(
        !cues.iter().any(|c| c.start_ms == 3_723_040),
        "an override-only line is empty"
    );
}

#[test]
fn ass_follows_the_format_line_order() {
    let ass = "[Events]
Format: Start, End, Text, Layer
Dialogue: 0:00:01.00,0:00:02.00,順序不同,0
";
    // Fields are looked up by name, not position. (Real files always put Text last, which is
    // what lets commas inside it survive.)
    let cues = parse_ass(ass).unwrap();
    assert_eq!(cues[0].text, "順序不同");
    assert_eq!(cues[0].start_ms, 1000);
}

#[test]
fn ass_without_a_format_line_is_a_parse_error() {
    let err = parse_ass("[Events]\nDialogue: 0,0:00:01.00,0:00:02.00,,,0,0,0,,x\n").unwrap_err();
    assert!(matches!(err, SubsError::Parse(_)));
}

const SRT: &str = "1\r
00:00:01,000 --> 00:00:02,500\r
<i>這一切都是</i>\r
命運石之門的選擇。\r
\r
2\r
00:00:03,000 --> 00:00:04,000 X1:100 X2:200 Y1:10 Y2:20\r
{\\an8}畫面上方的字\r
\r
3\r
00:00:05,000 --> 00:00:06,000\r
\r
4\r
01:00:00,250 --> 01:00:01,000\r
<font color=\"#ff0000\">最後</font>一句\r
";

#[test]
fn srt_strips_tags_and_splits_lines_into_text_and_translation() {
    let cues = parse_srt(SRT).unwrap();
    let texts: Vec<&str> = cues.iter().map(|c| c.text.as_str()).collect();
    assert_eq!(texts, ["這一切都是", "畫面上方的字", "最後一句"]);
    // SRT follows the same rule: the first line is 原文, the rest 譯文.
    assert_eq!(cues[0].translation.as_deref(), Some("命運石之門的選擇。"));
    assert_eq!(cues[1].translation, None);
    assert_eq!((cues[0].start_ms, cues[0].end_ms), (1000, 2500));
    assert_eq!(cues[2].start_ms, 3_600_250);
}

#[test]
fn srt_without_counters_still_parses() {
    let cues = parse_srt("00:00:01,000 --> 00:00:02,000\nA\n\n00:00:03,000 --> 00:00:04,000\nB\n")
        .unwrap();
    assert_eq!(cues.len(), 2);
}

#[test]
fn srt_with_a_broken_timing_line_is_a_parse_error() {
    assert!(matches!(
        parse_srt("1\n00:00:xx,000 --> 00:00:02,000\nA\n").unwrap_err(),
        SubsError::Parse(_)
    ));
}

#[test]
fn legacy_big5_and_utf16_files_decode() {
    let (big5, _, _) = encoding_rs::BIG5
        .encode("這一切都是命運石之門的選擇。這是繁體中文的字幕檔案，用來測試編碼偵測是否正確。");
    assert!(decode(&big5).starts_with("這一切都是命運石之門的選擇"));

    let mut utf16 = vec![0xFF, 0xFE];
    for unit in "人類的壽命".encode_utf16() {
        utf16.extend_from_slice(&unit.to_le_bytes());
    }
    assert_eq!(decode(&utf16), "人類的壽命");
    assert_eq!(decode("\u{feff}ＵＴＦ８".as_bytes()), "ＵＴＦ８");
}

#[test]
fn parse_file_names_its_failures() {
    let dir = tempfile::tempdir().unwrap();
    let missing = dir.path().join("none.srt");
    assert!(matches!(parse_file(&missing), Err(SubsError::NotFound(_))));

    let vtt = dir.path().join("a.vtt");
    std::fs::write(&vtt, "WEBVTT").unwrap();
    assert!(matches!(
        parse_file(&vtt),
        Err(SubsError::UnsupportedFormat(_))
    ));

    let empty = dir.path().join("b.ass");
    std::fs::write(
        &empty,
        "[Events]\nFormat: Start, End, Text\nComment: 0:00:01.00,0:00:02.00,x\n",
    )
    .unwrap();
    assert!(matches!(parse_file(&empty), Err(SubsError::NoCues)));

    let ok = dir.path().join("c.SRT");
    std::fs::write(&ok, SRT).unwrap();
    assert_eq!(parse_file(&ok).unwrap().len(), 3);
}
