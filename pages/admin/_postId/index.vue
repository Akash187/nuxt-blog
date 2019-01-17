<template>
  <div class="admin-post-page">
    <section class="update-form">
      <admin-post-form :post="loadedPost" @submit="submitted"/>
    </section>
  </div>
</template>

<script>
  import AdminPostForm from '~/components/Admin/AdminPostForm';
  import axios from 'axios';

  export default {
    layout: 'admin',
    middleware: ['checkAuth','auth'],
    components: {
      AdminPostForm
    },
    asyncData(context) {
      return axios.get('https://nuxt-blog-99a13.firebaseio.com/posts/' + context.params.postId + '.json')
        .then(res => {
          return {
            loadedPost : {...res.data, id: context.params.postId }
          }
        })
        .catch(error => console.log(error))
    },
    methods: {
      submitted(editedPost){
        this.$store.dispatch('editPost', editedPost).then(() => {
          this.$router.push("/admin");
        });
      }
    }
  }

</script>

<style scoped>
  .update-form {
    width: 90%;
    margin: 20px auto;
  }
  @media (min-width: 768px) {
    .update-form {
      width: 500px;
    }
  }
</style>
