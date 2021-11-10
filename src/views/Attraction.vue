<template>
    <b-container>
      <b-row>
        <b-col>
          <h1 class="big-title mb-6">景點</h1>
          <h5 class="h5 description mb-12">
            台灣的各個美景，都美不勝收。<br>
            等你一同來發現這座寶島的奧妙！
          </h5>
        </b-col>
      </b-row>

      <b-row class="mb-20">
        <b-col>
          <Card title="AAA" address="BBB" type="CCC" imgSrc="https://images.unsplash.com/photo-1542312743-e4a4a04f412a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80"></Card>
        </b-col>
        <b-col>
          <Card></Card>
        </b-col>
        <b-col>
          <Card></Card>
        </b-col>        
        <b-col>
          <Card></Card>
        </b-col>
      </b-row>

      <b-row class="mb-30">
        <b-col>
          <Card title="AAA" address="BBB" type="CCC" imgSrc="https://images.unsplash.com/photo-1542312743-e4a4a04f412a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80"></Card>
        </b-col>
        <b-col>
          <Card></Card>
        </b-col>
        <b-col>
          <Card></Card>
        </b-col>        
        <b-col>
          <Card></Card>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
  import Card from '../components/Card.vue';

  export default({
      name:'Attraction',
      components:{
          Card,

      }
  })
</script>