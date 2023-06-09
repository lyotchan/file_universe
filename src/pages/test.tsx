import { useSelector, useDispatch } from 'react-redux'
import {
  increment,
  decrement,
  incrementByAmount
} from '../store/features/counter/counterSlice'
import { RootState } from '../store'
import ThemeSwitcher from '@/components/Header/ThemeSwitcher'
export default function Home() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  console.log('test')
  return (
    <div>
      <ThemeSwitcher></ThemeSwitcher>
      <h1>Counter: {count}</h1>
      <button
        className="btn shadow-primary"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <button className="btn" onClick={() => dispatch(decrement())}>
        Decrement
      </button>
      <button className="btn" onClick={() => dispatch(incrementByAmount(5))}>
        Increment by 5
      </button>
      <span>{process.env.NEXT_PUBLIC_DEV_PORT}</span>
    </div>
  )
}
