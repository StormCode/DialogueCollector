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

fn events(lines: &[&str]) -> String {
    let mut s = String::from(
        "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n",
    );
    for l in lines {
        s.push_str(l);
        s.push('\n');
    }
    s
}

#[test]
fn bilingual_events_with_the_same_timing_become_one_cue() {
    let cues = parse_ass(&events(&[
        // The Chinese comes first in the file; the JP style still makes the Japanese the 原文.
        "Dialogue: 9,0:00:29.47,0:00:31.76,OP - CN,,0,0,0,,{\\blur2}故事迎來完結",
        "Dialogue: 9,0:00:29.47,0:00:31.76,OP - JP,,0,0,0,,{\\blur2}物語は終わり",
        "Dialogue: 0,0:01:00.00,0:01:02.00,Text - JP,,0,0,0,,勇者は眠りにつく",
        "Dialogue: 0,0:01:00.00,0:01:02.00,Text - CN,,0,0,0,,勇者進入長眠",
    ]))
    .unwrap();
    let got: Vec<_> = cues
        .iter()
        .map(|c| (c.text.as_str(), c.translation.as_deref()))
        .collect();
    assert_eq!(
        got,
        [
            ("物語は終わり", Some("故事迎來完結")),
            ("勇者は眠りにつく", Some("勇者進入長眠"))
        ]
    );
}

#[test]
fn without_style_tags_the_kana_line_is_the_original() {
    let cues = parse_ass(&events(&[
        "Dialogue: 0,0:00:01.00,0:00:02.00,Upper,,0,0,0,,在這片土地留下的",
        "Dialogue: 0,0:00:01.00,0:00:02.00,Lower,,0,0,0,,この地に残して",
        "Dialogue: 0,0:00:03.00,0:00:04.00,Upper,,0,0,0,,Hello there",
        "Dialogue: 0,0:00:03.00,0:00:04.00,Lower,,0,0,0,,你好",
    ]))
    .unwrap();
    assert_eq!(cues[0].text, "この地に残して");
    assert_eq!(cues[0].translation.as_deref(), Some("在這片土地留下的"));
    // Nothing says which is the original (like 86's 「下一話」「先鋒」 title card): kept apart.
    assert_eq!(cues.len(), 3);
    assert!(cues[1..].iter().all(|c| c.translation.is_none()));
}

#[test]
fn other_shared_timings_are_left_alone() {
    let cues = parse_ass(&events(&[
        // Two lines in one style (credits, two speakers at once).
        "Dialogue: 0,0:02:01.02,0:02:04.02,Title,,0,0,0,,字幕製作：北宇治字幕組",
        "Dialogue: 0,0:02:01.02,0:02:04.02,Title,,0,0,0,,斷頭台阿烏拉",
        // Three events of no plain language at one time.
        "Dialogue: 0,0:03:00.00,0:03:01.00,A,,0,0,0,,一",
        "Dialogue: 0,0:03:00.00,0:03:01.00,B,,0,0,0,,二",
        "Dialogue: 0,0:03:00.00,0:03:01.00,C,,0,0,0,,三",
        // Two speakers at once, each in its own tagged style.
        "Dialogue: 0,0:05:00.00,0:05:01.00,Text - CN,,0,0,0,,甲說的話",
        "Dialogue: 0,0:05:00.00,0:05:01.00,Text - CN - UP,,0,0,0,,乙說的話",
        "Dialogue: 0,0:06:00.00,0:06:01.00,Text - JP,,0,0,0,,行こう",
        "Dialogue: 0,0:06:00.00,0:06:01.00,Text - JP - UP,,0,0,0,,待って",
        // Already bilingual through \N.
        "Dialogue: 0,0:04:00.00,0:04:01.00,JP,,0,0,0,,原文\\N譯文",
        "Dialogue: 0,0:04:00.00,0:04:01.00,CN,,0,0,0,,另一句",
    ]))
    .unwrap();
    assert_eq!(cues.len(), 11);
    let translated: Vec<_> = cues
        .iter()
        .filter(|c| c.translation.is_some())
        .map(|c| c.text.as_str())
        .collect();
    assert_eq!(
        translated,
        ["原文"],
        "only the \\N line carries a translation"
    );
}

#[test]
fn a_line_split_over_several_events_pairs_as_a_whole() {
    let cues = parse_ass(&events(&[
        "Dialogue: 9,0:00:47.74,0:00:51.82,OP - CN,,0,0,0,,可是你的話語  你的願望與勇氣",
        "Dialogue: 8,0:00:47.74,0:00:51.82,OP - JP,,0,0,0,,それでも君の言葉も",
        "Dialogue: 8,0:00:47.74,0:00:51.82,OP - JP,,0,0,0,,願いも勇気も",
        // A spell name with its reading, over the Japanese.
        "Dialogue: 9,0:16:00.23,0:16:01.23,Text - CN,,0,0,0,,Baruterie",
        "Dialogue: 8,0:16:00.23,0:16:01.23,Text - CN,,0,0,0,,驅血魔法",
        "Dialogue: 7,0:16:00.23,0:16:01.23,Text - JP,,0,0,0,,血を操る魔法",
    ]))
    .unwrap();
    let got: Vec<_> = cues
        .iter()
        .map(|c| (c.text.as_str(), c.translation.as_deref()))
        .collect();
    assert_eq!(
        got,
        [
            (
                "それでも君の言葉も 願いも勇気も",
                Some("可是你的話語  你的願望與勇氣")
            ),
            ("血を操る魔法", Some("Baruterie 驅血魔法")),
        ]
    );
}

fn styled(styles: &[&str], lines: &[&str]) -> String {
    let mut s = String::from(
        "[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, ScaleX, ScaleY, Alignment\n",
    );
    for st in styles {
        s.push_str(st);
        s.push('\n');
    }
    s + &events(lines)
}

#[test]
fn the_larger_side_of_a_bilingual_pair_is_the_original() {
    let cues = parse_ass(&styled(
        &[
            "Style: Dial_JP,A,65,&H0,100,100,2",
            "Style: Dial_CH,B,74,&H0,100,100,2",
            "Style: Small_CH,B,90,&H0,100,50,2",
        ],
        &[
            // 主字幕 is the larger one, whatever its language.
            "Dialogue: 0,0:00:01.00,0:00:02.00,Dial_JP,,0,0,0,,待ってフリーレン",
            "Dialogue: 0,0:00:01.00,0:00:02.00,Dial_CH,,0,0,0,,等等芙莉蓮",
            // ScaleY counts: 90 × 50% is smaller than 65.
            "Dialogue: 0,0:00:03.00,0:00:04.00,Dial_JP,,0,0,0,,歩けない",
            "Dialogue: 0,0:00:03.00,0:00:04.00,Small_CH,,0,0,0,,走不動了",
            // An override wins over the style.
            "Dialogue: 0,0:00:05.00,0:00:06.00,Dial_JP,,0,0,0,,{\\fs80}はい",
            "Dialogue: 0,0:00:05.00,0:00:06.00,Dial_CH,,0,0,0,,是",
        ],
    ))
    .unwrap();
    let got: Vec<_> = cues
        .iter()
        .map(|c| (c.text.as_str(), c.translation.as_deref()))
        .collect();
    assert_eq!(
        got,
        [
            ("等等芙莉蓮", Some("待ってフリーレン")),
            ("歩けない", Some("走不動了")),
            ("はい", Some("是")),
        ]
    );
}

#[test]
fn within_one_event_the_larger_line_is_the_original() {
    let cues = parse_ass(&styled(
        &["Style: Default,A,60,&H0,100,100,2"],
        &[
            "Dialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,{\\fs40}この地に残して\\N{\\fs60}在這片土地留下的",
            // Same size: the first line, as before.
            "Dialogue: 0,0:00:03.00,0:00:04.00,Default,,0,0,0,,一行目\\N二行目",
            // \r goes back to the style's size; an animated \fs doesn't count.
            "Dialogue: 0,0:00:05.00,0:00:06.00,Default,,0,0,0,,{\\fs30}小さい\\N{\\r\\t(0,500,\\fs10)}大きい",
        ],
    ))
    .unwrap();
    let got: Vec<_> = cues
        .iter()
        .map(|c| (c.text.as_str(), c.translation.as_deref()))
        .collect();
    assert_eq!(
        got,
        [
            ("在這片土地留下的", Some("この地に残して")),
            ("一行目", Some("二行目")),
            ("大きい", Some("小さい")),
        ]
    );
}

#[test]
fn sizes_dont_pair_what_the_languages_dont() {
    let cues = parse_ass(&styled(
        &[
            "Style: TEXT-CN,A,57,&H0,100,100,2",
            "Style: TEXT-CN(UP),A,50,&H0,100,100,8",
        ],
        &[
            // Two speakers at once, sized apart: still two lines.
            "Dialogue: 0,0:05:00.00,0:05:01.00,TEXT-CN,,0,0,0,,甲說的話",
            "Dialogue: 0,0:05:00.00,0:05:01.00,TEXT-CN(UP),,0,0,0,,乙說的話",
        ],
    ))
    .unwrap();
    assert_eq!(cues.len(), 2);
    assert!(cues.iter().all(|c| c.translation.is_none()));
}

#[test]
fn a_line_cut_in_two_to_restyle_it_is_one_line() {
    let cues = parse_ass(&events(&[
        "Dialogue: 1,0:13:32.25,0:13:33.04,Text - CN,,0,0,0,,{\\bord1.5}但我不願意拋下他們",
        "Dialogue: 0,0:13:32.25,0:13:33.04,Text - JP,,0,0,0,,{\\bord1.5}見捨てるつもりはないよ",
        "Dialogue: 1,0:13:33.04,0:13:36.96,Text - CN,,0,0,0,,{\\bord2}但我不願意拋下他們",
        "Dialogue: 0,0:13:33.04,0:13:36.96,Text - JP,,0,0,0,,{\\bord2}見捨てるつもりはないよ",
        // Said again after a pause: its own line.
        "Dialogue: 0,0:13:40.00,0:13:41.00,Text - CN,,0,0,0,,但我不願意拋下他們",
        "Dialogue: 0,0:13:40.00,0:13:41.00,Text - JP,,0,0,0,,見捨てるつもりはないよ",
    ]))
    .unwrap();
    let got: Vec<_> = cues.iter().map(|c| (c.start_ms, c.end_ms)).collect();
    assert_eq!(got, [(812_250, 816_960), (820_000, 821_000)]);
}
