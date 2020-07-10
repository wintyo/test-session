import * as path from 'path';
import Express = require('express');
import passport = require('passport');
import passportLocal = require('passport-local');
import session = require('express-session');
const { Strategy: LocalStrategy } = passportLocal;

const app = Express();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`START SERVER http://localhost:${PORT}`);
});

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(path.resolve(__dirname, './public')));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'passport test',
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true,
  },
  (req, username, password, done) => {
    if (username === "test" && password === "test") {
      return done(null, username)
    } else {
      console.log("login error")
      return done(null, false, { message: 'パスワードが正しくありません。' })
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// ログインPOST遷移
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login.html',
  session: true,
}));

// ログイン後のユーザ名を取得する
app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send(null);
    return;
  }

  res.send(req.user);
});

// ログインAPI
app.post(
  '/api/login',
  passport.authenticate('local', {
    session: true,
  }),
  (req, res) => {
    res.send('success');
  }
);

// ログアウトAPI
app.get('/api/logout', (req, res) => {
  req.logout();
  res.send('success');
});
