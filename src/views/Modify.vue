<template>
  <div class="modify">
    <div class="dashboard-wrapper">
      <div class="dashboard-ecommerce">
        <div class="container-fluid dashboard-content ">
          <div class="row">
            <div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
              <form class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pr-xl-0 pr-lg-0 pr-md-0  m-b-30">
                  <div class="product-slider">
                    <img class="d-block" :src="image" alt="First slide" width="285" height="313">
                    Image URL <input type="text" @focusout="showPicture" id="imageLink" :value="image">
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pl-xl-0 pl-lg-0 pl-md-0 border-left m-b-30">
                  <div class="product-details">
                    <div class="border-bottom pb-3 mb-3">
                      <h2 class="mb-3">
                        <input type="text" :value="name" minlength="4" id="name" required/>
                      </h2>
                      <h3 class="mb-0 text-primary">$<input type="number" :value="price" step="0.01" id="price" required></h3>
                    </div>
                    <div class="product-size border-bottom">
                      <h4>Provider</h4>
                      <input type="text" :value="provider" minlength="3" id="provider" required>
                      <div class="product-qty">
                        <h4>Quantity</h4>
                        <div class="quantity">
                          <input type="number" :value="quantity" id="quantity" required>
                        </div>
                      </div>
                    </div>
                    <div class="product-description">
                      <h4 class="mb-1">Description</h4>
                      <textarea rows="4" cols="50" minlength="50" id="description" :value="description" required></textarea>
                      <button @click="modifyProductToDb" class="btn btn-primary btn-block btn-lg">Save</button>
                    </div>
                  </div>
                </div>
              </form>
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

export default {
  data: function() {
    return {
      db:null,
      ready:false,
      reload: false,
      addDisabled:false,
      products:[],
      name: "Error, ProductID Not Found!",
      price: 0,
      quantity: 0,
      provider: "Sample Text",
      description: "Sample Text",
      image: "https://i.imgur.com/O9oZoje.png",
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
    async modifyProductToDb() {
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
        store.put({
          id: Number(this.$route.params.id),
          name: document.getElementById("name").value,
          provider: document.getElementById("provider").value,
          price: document.getElementById("price").value,
          quantity: document.getElementById("quantity").value,
          description: document.getElementById("description").value,
          image: document.getElementById("imageLink").value,
        });
        this.getProductsFromDb();
      });
    },
    showPicture() {
      let link = document.getElementById("imageLink").value;
      if(link !== "")
        this.image = link;
    },
  }
}
</script>

<style scoped>

</style>