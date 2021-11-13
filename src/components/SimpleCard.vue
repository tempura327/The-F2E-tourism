<template>
    <div>
        <b-card :style="`background-image: url(${imgSrc}); background-size: cover;`" class="mb-6" @click="showModal(data)"></b-card>
        <h2 class="card-title h2 text-center" @click="showModal(data, 'attraction')">{{title}}</h2>
    </div>
</template>

<script>

    export default({
        name:'SimpleCard',
        props:{
            data:{
                type:Object
            },
            title:{
                type:String
            },
            imgSrc:{
                type:String
            }
        },
        methods:{
            showModal(data, type){
                this.$emit('showModal', data, type);
            }
        }
    })
</script>


<style scoped>
    .card-title, .card{
        cursor: pointer;
    }

    .card-title:hover{
        color: #08A6BB;
    }

    .card{
        width: 100%;
        height: 324px;
        border-radius: 10px;
        box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px rgba(255, 255, 255, 0.6), 4px 4px 20px rgba(111, 140, 176, 0.41);
    }

    .card-img{
        width: 100%;
        height: 100%;
    }
</style>