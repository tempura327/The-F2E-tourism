<template>
    <b-card>
        <img :src="imgSrc" alt="" class="mb-6 ">
        <h2 class="title h2">{{title}}</h2>
    </b-card>
</template>

<script>


    export default({
        name:'SimpleCard',
        props:{
            title:{
                type:String
            },
            imgSrc:{
                type:String
            }
        }
    })
</script>


<style scoped>
    .des{
        color: #313131;
        font-weight: 700;
    }

    .card{
        width: 100%;
        height: 324px;
        border-radius: 10px;
    }
</style>