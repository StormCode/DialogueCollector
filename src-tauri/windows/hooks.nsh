; Installer hooks (bundle.windows.nsis.installerHooks).
;
; An update starts this installer and only then quits the app, so the app can still be exiting
; when its files are about to be overwritten. Tauri's CheckIfAppIsRunning kills it and waits a
; fixed 500 ms, and when the exe is still locked after that, `File` stops on "無法開啟要寫入的檔案"
; (seen on Windows updating 0.1.7 → 0.1.8). So before that check: let the app finish quitting,
; end it if it doesn't, and wait until its files can actually be written.

; Waits until FILE can be opened for writing, or TRIES × 250 ms have passed. A missing file is
; writable.
!macro DC_WaitWritable FILE TRIES
  Push $0
  Push $1
  StrCpy $1 0
  ${Do}
    ${IfNot} ${FileExists} "${FILE}"
      ${Break}
    ${EndIf}
    ClearErrors
    FileOpen $0 "${FILE}" a
    ${IfNot} ${Errors}
      FileClose $0
      ${Break}
    ${EndIf}
    IntOp $1 $1 + 1
    ${If} $1 >= ${TRIES}
      DetailPrint "${FILE} is still locked"
      ${Break}
    ${EndIf}
    Sleep 250
  ${Loop}
  Pop $1
  Pop $0
!macroend

!macro NSIS_HOOK_PREINSTALL
  Push $0
  Push $1
  ; Up to 5 s for the app to quit on its own.
  StrCpy $1 0
  ${Do}
    nsis_tauri_utils::FindProcessCurrentUser "${MAINBINARYNAME}.exe"
    Pop $0
    ${If} $0 <> 0
      ${Break}
    ${EndIf}
    IntOp $1 $1 + 1
    ${If} $1 >= 20
      DetailPrint "${MAINBINARYNAME}.exe did not quit; ending it"
      nsis_tauri_utils::KillProcessCurrentUser "${MAINBINARYNAME}.exe"
      Pop $0
      ${Break}
    ${EndIf}
    Sleep 250
  ${Loop}
  Pop $1
  Pop $0
  ; A process that is gone can still hold its image for a moment.
  !insertmacro DC_WaitWritable "$INSTDIR\${MAINBINARYNAME}.exe" 40
  !insertmacro DC_WaitWritable "$INSTDIR\ffmpeg.exe" 40
  !insertmacro DC_WaitWritable "$INSTDIR\ffprobe.exe" 40
!macroend
