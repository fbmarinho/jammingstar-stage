const midiSelect = document.getElementById("devices");
const startButton = document.getElementById("connect_button");
const pressed = document.getElementById("pressed");
const eventos = document.getElementById("eventos");
const status = document.getElementById("status");

let midiAccess = null;
let currentInput = null;
var pressednotes = [];

function logEvent(message) {
  eventos.textContent = message;
}

function logStatus(message) {
  status.textContent = message;
}

startMIDI();

async function startMIDI() {
  if (!navigator.requestMIDIAccess) {
    alert("Web MIDI API não suportada neste navegador.");
    return;
  }

  try {
    midiAccess = await navigator.requestMIDIAccess();
    populateMIDIPorts();

    midiAccess.onstatechange = () => {
      populateMIDIPorts();
    };

    logStatus("Conexão MIDI estabelecida. Selecione um dispositivo.");
  } catch (error) {
    console.error("Erro ao acessar MIDI:", error);
    //alert("Erro ao acessar MIDI. Veja o console para detalhes.");
  }
}

function populateMIDIPorts() {
  midiSelect.innerHTML =
    '<option value="">Selecione um dispositivo MIDI</option>';
  var first = true;
  for (const input of midiAccess.inputs.values()) {
    const option = document.createElement("option");
    option.value = input.id;
    option.textContent = input.name;
    if (first) {
      option.selected = first;
      first = false;
    }
    midiSelect.appendChild(option);
  }
  connectSelectedDevice();
}

function handleMIDIMessage(event) {
  const data = event.data;
  const hexData = Array.from(data)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join(" ");
  const [status, note, velocity] = data;
  let noteInfo = "";

  if ((status & 0xf0) === 0x90 && velocity !== 0) {
    noteInfo = `Note On: ${noteNumberToName(note)} Velocidade ${velocity}`;

    pressednotes.push(noteNumberToName(note));
  } else if (
    (status & 0xf0) === 0x80 ||
    ((status & 0xf0) === 0x90 && velocity === 0)
  ) {
    noteInfo = `Note Off: ${noteNumberToName(note)}`;

    const index = pressednotes.indexOf(noteNumberToName(note));
    if (index > -1) {
      // only splice array when item is found
      pressednotes.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
  displayPressedNotes();
  logEvent(
    `[${event.timeStamp.toFixed(0)} ms] Dados MIDI: ${hexData} ${noteInfo}`
  );
}

function displayPressedNotes() {
  pressed.innerHTML = "";
  pressed.innerHTML = pressednotes.join("-");
}

function noteNumberToName(noteNumber) {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const noteIndex = noteNumber % 12;
  const octave = Math.floor(noteNumber / 12) - 1;
  return `${noteNames[noteIndex]}`;
}

function connectSelectedDevice() {
  if (currentInput) {
    currentInput.onmidimessage = null;
  }

  const selectedId = midiSelect.value;
  if (!selectedId) {
    logStatus("Nenhum dispositivo selecionado.");
    return;
  }

  const selectedInput = Array.from(midiAccess.inputs.values()).find(
    (input) => input.id === selectedId
  );

  if (selectedInput) {
    currentInput = selectedInput;
    currentInput.onmidimessage = handleMIDIMessage;
    logStatus(`Conectado ao dispositivo: ${currentInput.name}`);
  }
}

midiSelect.addEventListener("change", connectSelectedDevice);
