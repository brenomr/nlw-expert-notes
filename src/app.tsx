import { useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');

    if (savedNotes) {
      return JSON.parse(savedNotes);
    } else {
      return []
    }
  });

  const onNoteCreated = (content: string ) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }
  
    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes = search !== ''
  ? notes.filter(note => note.content.toLocaleLowerCase().includes(search))
  : notes;

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt="Logo do NLW Expert" />
      <form className='w-full' action="">
        <input
          type='text'
          placeholder='Busque suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder: text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700'/>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {
          filteredNotes.map(note => (<NoteCard note={note} key={note.id} />))
        }
      </div>
    </div>
  )
}
