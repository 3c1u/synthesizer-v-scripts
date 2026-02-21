const SCRIPT_TITLE = 'Swing Notes'
const TRANSLATIONS = {
  'ja-jp': [
    [SCRIPT_TITLE, 'ノートをスイングさせる'],
    ['Swing Value', 'スイング値'],
  ],
  'en-us': [
    [SCRIPT_TITLE, 'Swing Notes'],
    ['Swing Value', 'Swing Value'],
  ],
}

function getClientInfo() {
  return {
    name: SV.T(SCRIPT_TITLE),
    author: 'Hikaru Terazono',
    versionNumber: 1,
    minEditorVersion: 66048,
  }
}

function getTranslation(langCode: string) {
  return TRANSLATIONS[langCode] ?? TRANSLATIONS['en-us']
}

function sign(x: number): number {
  return x < 0 ? -1 : 1
}

function swingTime(time: number, swingValue: number): number {
  const swingAmount = swingValue / 100
  return Math.pow(time, Math.log(swingAmount) / Math.log(0.5))
}

function main() {
  const myForm = {
    title: SV.T(SCRIPT_TITLE),
    buttons: 'OkCancel',
    widgets: [
      {
        name: 'threshold',
        type: 'Slider',
        label: SV.T('Swing Value'),
        format: '%1.0f',
        minValue: 0,
        maxValue: 100,
        interval: 1,
        default: 50,
      },
    ],
  } as const

  const result = SV.showCustomDialog(myForm)
  const swingValue = Number(result.answers['threshold'] as number)

  if (result.status !== true) {
    SV.finish()
    return
  }

  const editor = SV.getMainEditor()
  const track = editor.getCurrentTrack()
  const numGroups = track.getNumGroups()

  for (let i = 0; i < numGroups; i++) {
    const group = track.getGroupReference(i)
    const numNotes = group.getTarget().getNumNotes()

    for (let j = 0; j < numNotes; j++) {
      const note = group.getTarget().getNote(j)
      const noteStartTick = note.getOnset()
      const noteEndTick = note.getEnd()

      const nodeStartFrac = noteStartTick % SV.QUARTER
      const nodeEndFrac = noteEndTick % SV.QUARTER

      const noteStartGrid = noteStartTick - nodeStartFrac
      const noteEndGrid = noteEndTick - nodeEndFrac

      const nodeStartFracPerQuarter = nodeStartFrac / SV.QUARTER
      const nodeEndFracPerQuarter = nodeEndFrac / SV.QUARTER

      const swingedStart = Math.floor(
        noteStartGrid +
          swingTime(nodeStartFracPerQuarter, swingValue) * SV.QUARTER,
      )
      const swingedEnd = Math.ceil(
        noteEndGrid + swingTime(nodeEndFracPerQuarter, swingValue) * SV.QUARTER,
      )

      const duration = swingedEnd - swingedStart

      note.setOnset(swingedStart)
      note.setDuration(duration)
    }
  }

  SV.finish()
}
