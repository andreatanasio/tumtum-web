import React, { useState } from 'react';
import axios from 'axios';
import logo from './logo.png';
import './App.css';

const URL_BACKEND = "https://projeto-tum-tum.herokuapp.com";

const ERRO_SERVIDOR = "Resposta inesperada do servidor. Não foi possível realizar o login.";
const ERRO_CREDENCIAIS = "Login inválido!"
const ERRO_PREENCHIMENTO = "E-mail e senha devem estar preenchidos!";
const MSG_REMOVIDO = "Conta removida com sucesso!";

function App() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  function changeSenha(event) {
    setSenha(event.target.value);
  }

  function efetivarRemocao(token) {
    axios.delete(
      URL_BACKEND + "/remover/" + email, 
      {headers: {
          'authorization': 'Bearer ' + token
        }
      }
    )
    .then((response) => {
      if (response.status === 200) {
        alert(MSG_REMOVIDO);                  
      } else {
        alert(ERRO_SERVIDOR);
      }                
    })
    .catch((error) => {                                            
      alert(ERRO_SERVIDOR);
    });        
  }

  function excluir() {
    if (email.trim().length === 0 || senha.trim().length === 0) {
      alert(ERRO_PREENCHIMENTO);
    } else {
      axios.post(URL_BACKEND + "/autenticar", {
        email: email.trim(),
        password: senha.trim()
      })
      .then((response) => {
          if (response.status === 200) {                                        
              efetivarRemocao(response.data.token);
          } else {
            alert(ERRO_SERVIDOR);
          }                
      })
      .catch((error) => {       
        if (error.response === undefined) {
          alert(ERRO_SERVIDOR);
        } else if (error.response.status === 400) {
          alert(ERRO_CREDENCIAIS);
        } else {
          alert(ERRO_SERVIDOR);
        }
      });        
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo}  className="App-logo" alt="logo" />
        
        <p>
          Através desta página você pode excluir seu usuário no app TumTum.
        </p>

        <label>
          E-mail: 
          <input 
            type="text"
            className="App-input" 
            value={email}
            onChange={changeEmail}
          />
        </label>
        <label>
          Senha: 
          <input 
            type="password"
            className="App-input"
            value={senha}
            onChange={changeSenha}
          />
        </label>

        <button 
          style={{padding: '15px'}} 
          onClick={excluir}
        >
          Excluir usuário
        </button>
      </header>
    </div>
  );
}

export default App;
