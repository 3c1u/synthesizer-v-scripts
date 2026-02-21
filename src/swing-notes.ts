const SCRIPT_TITLE = 'Swing Notes'
const TRANSLATIONS = {
  'ja-jp': [
    [SCRIPT_TITLE, 'ノートをスイングさせる'],
    ['Swing Value', 'スイング値'],
    ['Time Scale', 'タイムスケール'],
    ['1/4 Note', '4分音符'],
    ['1/8 Note', '8分音符'],
    ['1/16 Note', '16分音符'],
  ],
  'en-us': [
    [SCRIPT_TITLE, 'Swing Notes'],
    ['Swing Value', 'Swing Value'],
    ['Time Scale', 'Time Scale'],
    ['1/4 Note', '1/4 Note'],
    ['1/8 Note', '1/8 Note'],
    ['1/16 Note', '1/16 Note'],
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

function getTranslations(langCode: string) {
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
      {
        name: 'timescale',
        type: 'ComboBox',
        label: SV.T('Time Scale'),
        choices: [SV.T('1/4 Note'), SV.T('1/8 Note'), SV.T('1/16 Note')],
        default: 1,
      },
    ],
  } as const

  const result = SV.showCustomDialog(myForm)
  const swingValue = Number(result.answers['threshold'] as number)
  const timescaleChoice = Number(result.answers['timescale'] as number)
  const timeScaleMultiplier = Math.pow(2, timescaleChoice)

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

    const timescale = SV.QUARTER / timeScaleMultiplier

    for (let j = 0; j < numNotes; j++) {
      const note = group.getTarget().getNote(j)
      const noteStartTick = note.getOnset()
      const noteEndTick = note.getEnd()

      const nodeStartFrac = noteStartTick % timescale
      const nodeEndFrac = noteEndTick % timescale

      const noteStartGrid = noteStartTick - nodeStartFrac
      const noteEndGrid = noteEndTick - nodeEndFrac

      const nodeStartFracPerQuarter = nodeStartFrac / timescale
      const nodeEndFracPerQuarter = nodeEndFrac / timescale

      const swingedStart = Math.ceil(
        noteStartGrid +
          swingTime(nodeStartFracPerQuarter, swingValue) * timescale,
      )
      const swingedEnd = Math.floor(
        noteEndGrid + swingTime(nodeEndFracPerQuarter, swingValue) * timescale,
      )

      const duration = swingedEnd - swingedStart

      note.setOnset(swingedStart)
      note.setDuration(duration)
    }
  }

  SV.finish()
}
