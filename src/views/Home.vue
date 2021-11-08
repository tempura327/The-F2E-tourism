<template>
    <b-container fluid>
        <Carousel></Carousel>
        <Card :imgSrc="'https://images.unsplash.com/photo-1636318124761-0e97c7d984d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=327&q=80'" :address="'AAA'" title="BBB" type="CCC"></Card>
    </b-container>
</template>

<script>
    import Carousel from '../components/Carousel.vue';
    import Card from '';
    // import SimpleCard from '';

    export default({
        name:'Home',
        components:{
            Carousel,
            Card,
            // SimpleCard,
        }
    })
</script>
