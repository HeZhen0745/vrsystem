 import withSession from '../../utils/session'

export default withSession(async (req, res) => {
  const user = req.session.get('user')
  if (user) {
    res.json({
      isLoggedIn: true,
      ...user,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
})