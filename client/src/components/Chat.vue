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
                    <img :src="item.msg" class="imgMsg">
                </template>
                <div v-if="['commonMsg', 'imgMsg'].includes(item.msgType)" class="time-item">
                    {{dayjs(item.time).format('MM-DD hh:mm:ss')}}
                </div>
            </li>
        </ul>
        <div class="bottom-box">
            <div v-if="userType  === 'customer'" class="keyword-options">
                <div>你可以尝试询问：</div>
                <button
                    v-for="(item, index) in keywordOptionList" :key="index"
                    class="keyword-item"
                    @click="handleSelectKeyword(item)"
                >
                    {{item}}
                </button>
            </div>
            <div class="input-body">
                <form id="form" @submit.prevent="handleSubmit">
                    <input id="input" autocomplete="off" v-model="sendMsg"/>
                    <button class="send-btn">Send</button>
                </form>
                <button>
                    <label class="img-input-label" for="img-input">upload img</label>
                </button>
                <input
                    id="img-input"
                    ref="imgInput"
                    name="file" type="file"
                    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                    class="hide"
                    @change="handleSubmitImg"
                />
            </div>
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
                },
            },
        },
        data() {
            return {
                socket: null,
                sendMsg: '',
                msgList: process.env.NODE_ENV === 'development'
                    ? [
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
                    ]
                    : [],
                keywordOptionList: [
                    '发货',
                    '包邮',
                    '尺寸',
                ],


                dayjs,
            };
        },
        mounted() {
            this.socket = io('/', {
                query: {
                    userType: this.userType,
                },
            });
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
            handleSubmitImg() {
                const formData = new FormData();
                if (!this.$refs.imgInput.files || !this.$refs.imgInput.files[0]) {
                    return alert('请先上传图片');
                }
                formData.set('userType', this.userType);
                formData.set('file', this.$refs.imgInput.files[0]);
                this.axios.post(
                    '/upload-file',
                    formData,
                    {headers: {'Content-Type': 'multipart/form-data'}},
                ).then(() => {
                    this.$refs.imgInput.value = null;
                });
            },
            handleSelectKeyword(keywordItem) {
                this.socket.emit('msgFromC', {
                    msg: keywordItem,
                    msgType: 'commonMsg',
                    userType: this.userType,
                });
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

                if (msgObj.msgType === 'imgMsg') {
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
            },
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

    .keyword-options {
        display: flex;
        padding: 4px 10px;
        border: 1px solid #efefef;
    }

    .keyword-item {
        margin-right: 10px;
    }

    .input-body {
        display: flex;
    }

    #form {
        flex: 1;
        padding: 0.25rem;
        height: 3rem;
        box-sizing: border-box;
        display: flex;
        background: rgba(0, 0, 0, 0.15);
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
