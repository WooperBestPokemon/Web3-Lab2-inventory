<template>
  <div class="product">
    <div class="dashboard-wrapper">
      <div class="dashboard-ecommerce">
        <div class="container-fluid dashboard-content ">

          <div class="row">
            <div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
              <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pr-xl-0 pr-lg-0 pr-md-0  m-b-30">
                  <div class="product-slider">
                    <img class="d-block" :src='image' alt="Product" width="285" height="313">
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pl-xl-0 pl-lg-0 pl-md-0 border-left m-b-30">
                  <div class="product-details">
                    <div class="border-bottom pb-3 mb-3">
                      <h2 class="mb-3">{{ name }}</h2>
                      <h3 class="mb-0 text-primary">${{ price }}</h3>
                    </div>
                    <div class="product-size border-bottom">
                      <h4>Provider</h4>
                      <div>{{ provider }}</div>
                      <div class="product-qty">
                        <h4>Quantity</h4>
                        <div class="quantity">
                          {{ quantity }}
                        </div>
                      </div>
                    </div>
                    <div class="product-description">
                      <h4 class="mb-1">Description</h4>
                      <p>{{ description }}</p>
                      <a :href="modify" class="btn btn-primary btn-block btn-lg">Modify</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const DB_NAME = 'DBInventory';
const DB_VERSION = 1;
const products = [];

//import Image from "@/assets/images/Team_Rocket.jpg";
export default {
  data: function() {
    return {
      db:null,
      ready:false,
      addDisabled:false,
      products:[],
      name: "Error, ProductID Not Found!",
      price: 0,
      quantity: 0,
      provider: "Sample Text",
      description: "Sample Text",
      image: "https://i.imgur.com/O9oZoje.png",
      //by default, the modify will redirect to adding a product
      modify: "#/products/add"
    };
  },
  async created() {
    this.db = await this.getDb();
    this.products = await this.getProductsFromDb();
    this.ready = true;
  },
  methods: {
    async getProductsFromDb() {
      return new Promise((resolve, reject) => {
        //delete me
        console.log(reject);
        let targetID = this.$route.params.id;
        let trans = this.db.transaction(['products'],'readonly');
        trans.oncomplete = e => {
          //delete me
          console.log(e);
          resolve(products);
        };

        let store = trans.objectStore('products');
        console.log("The target is " + targetID);

          store.openCursor().onsuccess = e => {
            let cursor = e.target.result;
            if (cursor) {
              products.push(cursor.value);
              console.log(cursor.value.id);
              console.log(targetID);
              //Kinda got confused here... so I manage to turn it into a while and when it find the right id, it kill the cursor and get the value.
              if (cursor.value.id != targetID)
                cursor.continue();
              else {
                this.name = cursor.value.name;
                this.provider = cursor.value.provider;
                this.quantity = cursor.value.quantity;
                this.price = cursor.value.price;
                this.description = cursor.value.description;
                this.image = cursor.value.image;
                this.modify = "#/products/" + cursor.value.id + "/edit";
              }
            }
            if (products.length === 0)
            {
              console.log("initialising product !")
              this.initProduct();
            }
        };
      });
    },
    async getDb() {
      return new Promise((resolve, reject) => {

        let request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = e => {
          console.log('Error opening db', e);
          reject('Error');
        };

        request.onsuccess = e => {
          resolve(e.target.result);
        };

        request.onupgradeneeded = e => {
          console.log('onupgradeneeded');
          let db = e.target.result;
          let objectStore = db.createObjectStore("products", { autoIncrement: true, keyPath:'id' });
          console.log(objectStore);
        };
      });
    },
    async initProduct() {
      this.addDisabled = true;
      let product = {
        name: "Pikachu Celebrations - 8 In.",
        provider: "Pokemon Center",
        price: 23.99,
        quantity: 10,
        description: "Pikachu is ready to graduate in cap and gown! This Pikachu Celebrations Poké Plush is ready to take that next step out into the wider world. You can grab this special Pokémon Center Original design for someone you know who is stepping up as a graduate.",
        image: "https://i.imgur.com/CJeMvjL.jpg"
      };
      console.log('about to add '+JSON.stringify(product));
      await this.addProductToDb(product);
      this.products = await this.getProductsFromDb();
      this.addDisabled = false;
    },
    async addProductToDb(product) {
      return new Promise((resolve, reject) => {
        //delete me
        console.log(reject);
        let trans = this.db.transaction(['products'],'readwrite');
        trans.oncomplete = e => {
          //delete me
          console.log(e);
          resolve();
        };

        let store = trans.objectStore('products');
        store.add(product);
      });
    },
  }
}
</script>

<style scoped>

</style>