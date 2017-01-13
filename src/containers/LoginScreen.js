import React, { Component } from 'react'

import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import '../styles/LoginScreen.styl'

export class LoginScreen extends Component {
  render () {
    return (
      <form>
        <Card className='loginScreen'>
          <CardTitle title='Goal Tracker' subtitle='Connexion' />
          <CardText>
            <TextField
              type='email'
              floatingLabelText='E-mail'
              fullWidth
              hintText='mon@email.tld'
              autoFocus
              required
            />
            <TextField
              type='password'
              floatingLabelText='Mot de passe'
              fullWidth
              hintText='super mot de passe'
              required
            />
          </CardText>
          <CardActions style={{ textAlign: 'center' }}>
            <RaisedButton label='Connecte-toi' labelPosition='before' primary
              icon={<ArrowForward />} type='submit'
            />
          </CardActions>
        </Card>
      </form>
    )
  }
}

export default LoginScreen
