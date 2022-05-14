<template>
  <div
    class="view login"
    v-if="state.username === '' || state.username === null"
  >
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Логин FamilyChat</h1>
        <label for="username">Имя</label>
        <input
          type="text"
          v-model="inputUsername"
          placeholder="Как вас зовут?"
        />
        <input type="submit" value="Login" />
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout">Выход</button>
      <h1>Добро пожаловать, {{ state.username }}!</h1>
    </header>
    <section class="chat-box">
      <div
        v-for="message in state.messages"
        :key="message.key"
        :class="
          message.username == state.username
            ? 'message current-user'
            : 'message'
        "
      >
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>
    <footer>
      <form @submit.prevent="SendMessage">
        <input type="text" v-model="inputMessage" placeholder="Сообщение..." />
        <input type="submit" value="Отправить" />
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import { messageListRef } from "./data";
import { set, onValue, push } from "firebase/database";

export default {
  setup() {
    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: [],
    });
    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    };

    const SendMessage = () => {
      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value,
      };

      const newMessageRef = push(messageListRef);
      set(newMessageRef, message);
      inputMessage.value = "";
    };

    const Logout = () => {
      state.username = "";
    };

    onMounted(() => {
      onValue(messageListRef, (snapshot) => {
        const data = snapshot.val();

        let messages = [];

        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
          });
        });

        state.messages = messages;
      });
    });

    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout,
    };
  },
};
</script>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #000000;

  &.login {
    align-items: center;
    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        padding: 50px 15px;
        border-radius: 16px;
        background-color: #000;
        box-shadow: 0 0 60px 30px #132544, 0 0 100px 60px #132544,
          0 0 140px 90px #132544;
        h1 {
          color: #738fed;
          font-size: 28px;
          margin-bottom: 30px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #b5ccff;
          font-size: 16px;
          transition: 0.4s;
        }
        input[type="text"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #000;
          transition: 0.4s;
          border: 1px solid #132544;
          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
          &:focus {
            background: #b5ccff;
          }
        }
        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #b5ccff;
          border-radius: 8px;
          color: #000;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;

          &:hover {
            background: #03e9f4;
            color: #050801;
            box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
              0 0 200px #03e9f4;
            -webkit-box-reflect: below 1px linear-gradient(transparent, #0005);
          }
        }
        &:focus-within {
          label {
            color: #ea526f;
          }
          input[type="text"] {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }
  &.chat {
    flex-direction: column;
    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;
      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;
        cursor: pointer;
        color: #738fed;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
        transition: 0.5s;
        &:hover {
          color: #ea526f;
        }
      }
      h1 {
        color: #738fed;
      }
    }
    .chat-box {
      border-radius: 24px 24px 0px 0px;
      background-color: #132544;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;
      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #b5ccff;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }
          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;
            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }
        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;
          .message-inner {
            max-width: 75%;
            .content {
              color: #fff;
              font-weight: 600;
              background-color: #ea526f;
            }
          }
        }
      }
    }
    footer {
      position: sticky;
      bottom: 0px;
      background-color: #000;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      form {
        display: flex;
        input[type="text"] {
          flex: 1 1 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #000;
          transition: 0.4s;
          border: 1px solid #132544;
          &::placeholder {
            color: #b5ccff;
            transition: 0.4s;
          }

          &:focus {
            background: #b5ccff;
            &::placeholder {
              color: #333;
            }
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;
          background-color: #ea526f;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
