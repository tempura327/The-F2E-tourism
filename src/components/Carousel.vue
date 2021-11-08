<template>
    <div>
        <b-carousel :interval="4000" indicators class="carousel">
            <b-carousel-slide caption="AAA" img-src="../assets/unsplash_dQejX2ucPBs.png"></b-carousel-slide>
            <b-carousel-slide caption="AAA" img-src="../assets/unsplash_eOpewngf68w.png"></b-carousel-slide>
            <b-carousel-slide caption="AAA" img-src="../assets/unsplash_JsuBKjHGDMM.png"></b-carousel-slide>
            <b-carousel-slide caption="AAA" img-src="../assets/unsplash_UWQP2mh5YJI.png"></b-carousel-slide>
            <b-carousel-slide caption="AAA" img-src="../assets/unsplash_Yizrl9N_eDA.png"></b-carousel-slide>
        </b-carousel>

        <b-input-group class="search">
            <b-select :options="typeOption" v-model="selectedType" class=""></b-select>
            <b-select :options="cityOption" v-model="selectedCity" class=""></b-select>    
            <b-input-append>
                <b-button variant="info">Q</b-button>
            </b-input-append>
        </b-input-group>
    </div>
</template>

<script>

export default({
    data(){
        return{
            cityOption:[
                {value:'Taipei', text:'台北'},
                {value:'NewTaipei', text:'新北'},
                {value:'Keelung', text:'基隆'}
            ],
            typeOption:[],
            selectedCity:'',
            selectedType:'',
            
        }
    },
})
</script>



<style>
    .carousel-item{
        height: 600px;
    }

    .carousel-indicators li{
        width: 12px;
        height: 12px;
        background-color: white;
        border-radius: 50%;
    }

    .carousel-caption {
        top: 50%;
        bottom: 50%;
        padding: 0;
        
    }   
    
    .carousel-caption *{
        font-size: 32px;
        font-weight: 700;
    }

    .search{
        position: relative;
        top: -250px;
        width: 60%;
        margin: 0 auto;
    }
</style>