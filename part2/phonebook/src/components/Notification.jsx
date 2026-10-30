const Notification = ({ message, type = 'notification' }) => {
  if (message === null) {
    return null
  }

  return <div className={type === 'error' ? 'error' : 'notification'}>{message}</div>
}

export default Notification
