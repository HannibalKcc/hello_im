<template>
    <div id="app">
        <template v-if="[null, undefined, ''].includes(userType)">
            <p>请选择您的用户类型</p>
            <button
                v-for="(typeItem) in userTypeList" :key="typeItem.type"
                @click="userType = typeItem.type"
            >
                {{typeItem.text}}
            </button>
        </template>
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
        }
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
</style>
