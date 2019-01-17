<template>
  <form @submit.prevent="onSave">
    <AppControlInput v-model="editedPost.author">Author Name</AppControlInput>

    <AppControlInput v-model="editedPost.title">Title</AppControlInput>

    <AppControlInput v-model="editedPost.thumbnail">Thumbnail Link</AppControlInput>

    <AppControlInput
      control-type="textarea"
      v-model="editedPost.content">Content</AppControlInput>

    <AppControlInput
      control-type="textarea"
      v-model="editedPost.previewText">Preview Text</AppControlInput>

    <AppButton type="submit">Save</AppButton>

    <AppButton
      type="button"
      style="margin-left: 10px"
      btn-style="cancel"
      @click="onCancel">Cancel</AppButton>
  </form>
</template>

<script>
  import AppButton from '~/components/UI/AppButton';
  import AppControlInput from '~/components/UI/AppControlInput';

  export default {
    components: {
      AppButton,
      AppControlInput
    },
    props: {
      post: {
        type: Object,
        required: false
      }
    },
    data(){
      return{
        editedPost: this.post ? {...this.post}: {
          author: '',
          title: '',
          thumbnail: '',
          content: ''
        }
      }
    },
    methods: {
      onSave(){
        this.$emit('submit', this.editedPost)
      },
      onCancel(){
        this.$router.push('/admin');
      }
    }
  }

</script>

<style scoped>
  .admin-page {
    padding: 20px;
  }

  .new-post {
    text-align: center;
    border-bottom: 2px solid #ccc;
    padding-bottom: 10px;
  }

  .existing-posts h1 {
    text-align: center;
  }
</style>
