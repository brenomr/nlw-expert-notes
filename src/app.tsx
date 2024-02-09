import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

export function App() {
  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6'>
      <img src={logo} alt="Logo do NLW Expert" />
      <form className='w-full' action="">
        <input
          type='text'
          placeholder='Busque suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder: text-slate-500'
        />
      </form>

      <div className='h-px bg-slate-700'/>

      <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard />
        <NoteCard note={{date: new Date('2024-01-02'), content: 'First card content!'}} />
        <NoteCard note={{date: new Date('2024-01-05'), content: 'Second card content!'}} />
      </div>
    </div>
  )
}
