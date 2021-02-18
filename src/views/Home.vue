<template>
  <div class="home">
    <div class="dashboard-wrapper">
      <div class="dashboard-ecommerce">
        <div class="container-fluid dashboard-content ">
          <div class="row">
            <div class="col-xl-9 col-lg-8 col-md-8 col-sm-12 col-12">
              <div class="row">
                <div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12" v-for="product in products" v-bind:key="product.id">
                  <div class="product-thumbnail">
                    <div class="product-img-head">
                      <div class="product-img">
                        <img :src="product.image" alt="" class="img-fluid" width="228" height="250"></div>
                    </div>
                    <div class="product-content">
                      <div class="product-content-head">
                        <h3 class="product-title">{{ product.name }}</h3>
                        <div class="product-price">${{ product.price }}</div>
                      </div>
                      <div class="product-btn">
                        <a :href="'#/products/' + product.id + '/edit'" class="btn btn-primary">Modify</a>
                        <a :href="'#/products/' + product.id" class="btn btn-outline-light">Details</a>
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
  </div>
</template>

<script>
const DB_NAME = 'DBInventory';
const DB_VERSION = 1;

export default {
  data: function() {
    return {
      db:null,
      ready:false,
      addDisabled:false,
      products:[]
    };
  },
  async created() {
    console.log("Created")
    this.db = await this.getDb();
    this.products = await this.getProductsFromDb();
    this.ready = true;
  },
  async mounted() {
    console.log("In Mounted");
  },
  methods: {
    async getProductsFromDb() {
      console.log("Getting Data from DB...");
      return new Promise((resolve, reject) => {
        //delete me
        console.log(reject);
        let trans = this.db.transaction(['products'],'readonly');
        trans.oncomplete = e => {
          //delete me
          console.log(e);
          resolve(products);
        };

        let store = trans.objectStore('products');
        let products = [];

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            products.push(cursor.value)
            cursor.continue();
          }
        };
        console.log("Finished getting DATA !");
      });
    },
    async getDb() {
      console.log("Getting DB");
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
        console.log("Finished getting DB");
      });
    }
  },
}
</script>
