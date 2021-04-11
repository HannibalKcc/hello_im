<template>
    <div id="app">
        <div v-if="[null, undefined, ''].includes(userType)" class="selectTypeBox p10">
            <p>请选择您的用户类型</p>
            <button
                v-for="(typeItem) in userTypeList" :key="typeItem.type"
                class="selectTypeBtn"
                @click="handleSelectUserType(typeItem.type)"
            >
                {{typeItem.text}}
            </button>
        </div>
        <Chat
            v-else
            :userType="userType"
        >
        </Chat>
    </div>
</template>

<script>
    import Chat from './components/Chat.vue';

    export default {
        name: 'App',
        components: {
            Chat,
        },
        data() {
            return {
                userType: null,

                userTypeList: [
                    {
                        type: 'customer',
                        text: '客户',
                    },
                    {
                        type: 'customerService',
                        text: '客服',
                    },
                ],
            };
        },
        methods: {
            handleSelectUserType(type) {
                this.userType = type;
                document.title = `client-${type}`;
            },
        },
    };
</script>

<style>
    body {
        margin: 0;
        padding-bottom: 3rem;
    }
</style>
<style scoped>
    #app {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .selectTypeBox > .selectTypeBtn:not(:last-child) {
        margin-right: 10px;
    }

    .p10 {
        padding: 10px;
    }
</style>
