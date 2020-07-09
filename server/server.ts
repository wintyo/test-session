import * as path from 'path';
// ビルドが上手くいかないのでとりあえずrequireにする
// import Express from 'express';
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import session from 'express-session';
const Express = require('express');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const session = require('express-session');

const app = Express();

const PORT = 3000;
const server = app.listen(process.env.PORT || 3000, () => {
  // @ts-ignore
  const host = server.address().address;
  // @ts-ignore
  const port = server.address().port;
  console.log(`START SERVER http://${host}:${port}`);
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
  // @ts-ignore
  (req, username, password, done) => {
    if (username === "test" && password === "test") {
      return done(null, username)
    } else {
      console.log("login error")
      return done(null, false, { message: 'パスワードが正しくありません。' })
    }
  }
));

// @ts-ignore
passport.serializeUser((user, done) => {
  done(null, user);
});

// @ts-ignore
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
// @ts-ignore
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
  // @ts-ignore
  (req, res) => {
    res.send('success');
  }
);
