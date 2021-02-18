<template>
  <div class="dashboard-header">
    <nav class="navbar navbar-expand-lg bg-nav-brown fixed-top" id="nav">
      <a class="navbar-brand" href="#">Inventory</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"><i class="fas fa-bars"></i></span>
      </button>
      <div class="collapse navbar-collapse " id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto navbar-right-top">
          <li class="nav-item">
            <div id="custom-search" class="top-search-bar">
              <input class="form-control" type="text" placeholder="Search..">
            </div>
          </li>
          <li class="nav-item dropdown notification">
            <a class="nav-link nav-icons" href="#/products/add" id="navbarDropdownMenuLink1"><i class="fas fa-plus-circle"></i> </a>
          </li>

        </ul>
      </div>
    </nav>
  </div>
  <router-view/>
</template>

<script>

</script>

<style>
@import "./assets/vendor/bootstrap/css/bootstrap.min.css";
@import "./assets/vendor/fonts/circular-std/style.css";
@import "./assets/libs/css/style.css";
@import "./assets/vendor/fonts/fontawesome/css/fontawesome-all.css";
</style>
