import * as Dialog from "@radix-ui/react-dialog";
import { set } from "date-fns";
import { X } from 'lucide-react';
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);


  const handleShowOnboarding = () => {
    setShowOnboarding(false);
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    
    const isEmpty = !value.length;

    setNoteContent(value);

    if (isEmpty) {
      setShowOnboarding(true);
    }
  }

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();

    if (noteContent.length === 0) {
      return;
    }

    onNoteCreated(noteContent);
    setNoteContent('');
    setShowOnboarding(true);

    toast.success('Nota salva com sucesso!');
  }

  const handleStartRecording = () => {
    const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window
      || 'SpeechRecognition' in window;
    
    if (!isSpeechRecognitionSupported) {
      toast.error('Seu navegador não suporta gravação de áudio.');
      return;
    }

    setIsRecording(true);
    setShowOnboarding(false);

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.interimResults = true;
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce(
        (text, result) => { return text.concat(result[0].transcript)
      }, '');
      
      setNoteContent(transcript);
    }

    speechRecognition.onerror = (event) => {
      console.error(event.error);
    }

    speechRecognition.start();
  }

  const handleStopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    setIsRecording(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 p-5 space-y-3  gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida em texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' />
        <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none'>

          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>

          <form 
            className='flex-1 flex flex-col'
          >
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>
              {showOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece <button type="button" onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={handleShowOnboarding} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                </p>
              ) : (
                <textarea
                autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                  value={noteContent}

                />
              )}
            </div>

            {isRecording ? (
              <button
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
                onClick={handleStopRecording}
                type='button'
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando. (click para interromper)
              </button>
            ) : (
              <button
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
                onClick={handleSaveNote}
                type='button'
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}