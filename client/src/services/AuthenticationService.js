import Api from '@/services/Api'

export default {
  listContacts () {
    return Api().insecure.get('/contact')
  },
  createContact (payload) {
    return Api().insecure.post('/contact/create', payload)
  },
  searchContact (payload) {
    return Api().insecure.post('/contact/search', payload)
  },
  updateContact (payload) {
    return Api().insecure.post('/contact/update', payload)
  },
  deleteContact (payload) {
    return Api().insecure.post('/contact/delete', payload)
  },
  sendEmail (payload) {
    return Api().insecure.post('/api/email', payload)
  },
  uploadFile (payload) {
    return Api().insecure.post('api/utils/upload', payload)
  },
  downloadFile (filename) {
    return Api().insecure.get(`/api/utils/download/${filename}`, {
      responseType: 'blob'
    })
  }
}
