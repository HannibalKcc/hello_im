<template>
    <div class="Chat" ref="chat">
        <ul class="msg-list">
            <li
                class="msg-item"
                v-for="(item, index) in msgList"
                :key="index"
                :class="getClassByMsgObj(item)"
            >
                <template v-if="['commonMsg', 'systemMsg'].includes(item.msgType)">
                    <div class="msg-body">{{item.msg}}</div>
                </template>
                <template v-else-if="'imgMsg' === item.msgType">
                    <img :src="item.msg" alt="" class="imgMsg">
                </template>
                <div v-if="['commonMsg', 'imgMsg'].includes(item.msgType)" class="time-item">
                    {{dayjs(item.time).format('MM-DD hh:mm:ss')}}
                </div>
            </li>
        </ul>
        <div class="bottom-box">
            <form id="form" @submit.prevent="handleSubmit">
                <input id="input" autocomplete="off" v-model="sendMsg"/>
                <button class="send-btn">Send</button>
            </form>
            <form
                id="formImg"
                @submit.prevent="handleSubmitImg"
            >
                <input name="userType" type="text" v-model="userType" class="hide">
                <input name="file" type="file"/>
                <button type="submit">Send File</button>
            </form>
        </div>
    </div>
</template>

<script>
    import {io} from 'socket.io-client';
    import dayjs from 'dayjs';

    export default {
        name: 'Chat',
        props: {
            userType: {
                required: true,
                validator: (val) => {
                    return ['customer', 'customerService'].includes(val);
                }
            },
        },
        data() {
            return {
                socket: null,
                sendMsg: '',
                msgList: [
                    {
                        msg: '你好',
                        msgType: 'commonMsg',
                        userType: 'customer',
                        time: 1618036030103,
                    },
                    {
                        msg: '客服已在线',
                        msgType: 'systemMsg',
                        userType: 'customerService',
                        time: 1618036090103,
                    },
                    {
                        msg: '你好，需要什么',
                        msgType: 'commonMsg',
                        userType: 'customerService',
                        time: 1618036090103,
                    },
                    {
                        msg: 'test.jpg',
                        msgType: 'imgMsg',
                        userType: 'customerService',
                        time: 1618046090103,
                    },
                ],

                dayjs,
            };
        },
        mounted() {
            this.socket = io();
            this.socket.on('msgFromS', (msgObj) => {
                this.msgList.push(msgObj);
                window.scrollTo(0, this.$refs.chat.scrollHeight);
            });
        },
        beforeDestroy() {
            this.socket.disconnect();
        },
        methods: {
            handleSubmit() {
                if (![null, undefined, ''].includes(this.sendMsg)) {
                    this.socket.emit('msgFromC', {
                        msg: this.sendMsg,
                        msgType: 'commonMsg',
                        userType: this.userType,
                    });
                    this.sendMsg = '';
                }
            },
            handleSubmitImg(e) {
                const formData = new FormData(e.target);
                this.axios.post(
                    '/upload-file',
                    formData,
                    {headers: {'Content-Type': 'multipart/form-data'}},
                );
            },

            getClassByMsgObj(msgObj) {
                const classList = [];
                if (msgObj.msgType === 'commonMsg') {
                    classList.push('commonMsg');
                    if (msgObj.userType === this.userType) {
                        classList.push('align-right');
                    } else {
                        classList.push('align-left');
                    }
                }

                if(msgObj.msgType === 'imgMsg') {
                     if (msgObj.userType === this.userType) {
                        classList.push('align-right');
                    } else {
                        classList.push('align-left');
                    }
                }

                if (msgObj.msgType === 'systemMsg') {
                    classList.push('align-center', 'systemMsg');
                }

                return classList;
            }
        },
    };
</script>

<style scoped>
    .bottom-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #form {
        background: rgba(0, 0, 0, 0.15);
        padding: 0.25rem;
        display: flex;
        height: 3rem;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
    }

    #input {
        border: none;
        padding: 0 1rem;
        flex-grow: 1;
        border-radius: 2rem;
        margin: 0.25rem;
    }

    #input:focus {
        outline: none;
    }

    .send-btn {
        background: #333;
        border: none;
        padding: 0 1rem;
        margin: 0.25rem;
        border-radius: 3px;
        outline: none;
        color: #fff;
    }

    .msg-list {
        padding: 0;
        margin: 0;
        list-style-type: none;
    }

    .msg-item {
        display: flex;
        flex-direction: column;
        padding: 0.5rem 1rem;
    }

    .commonMsg {
        font-size: 16px;
    }

    .systemMsg {
        font-size: 12px;
        color: #a5b5c1;
    }

    .imgMsg {
        width: 100px;
        height: 100px;
    }

    .align-left {
        align-items: flex-start;
    }

    .align-center {
        align-items: center;
    }

    .align-right {
        align-items: flex-end;
    }

    .hide {
        display: none;
    }
</style>
