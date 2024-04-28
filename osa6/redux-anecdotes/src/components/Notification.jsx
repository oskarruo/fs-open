import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'
import { useEffect } from 'react'

const Notification = () => {
  const dispatch = useDispatch()

  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [notification, dispatch])

  if (notification) {
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
  return (
    null
  )
}

export default Notification