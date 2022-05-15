
import Service from '../services'
import { API_URL } from '../../config/config'

const resource = `${API_URL}/departments`
export default {
    getAllItems (itemsPerPage, page, pageNumber) {
      const paginate = (itemsPerPage && itemsPerPage !== '') ? '&paginate=' + itemsPerPage : ''
      const pageN = (page && page !== '') ? '&page=' + page : ''
      const filterQuery = pageN + paginate
        return Service.get(`${resource}?${filterQuery}`)
        .then((response) => {
            if (response.status === 200) {
                return response.data.response
            }
        })
        .catch(error => {
          return error.response.data.errors[0]
        })
    },
    fetchOneItem (id) {
        return Service.get(`${resource}/${id}`)
        .then((response) => {
          if (response.status === 200) {
              return response.data.response
          }
      })
      .catch(error => {
        return error.response.data.errors[0]
      })
      },
      addItem (data) {
        return Service.post(`${resource}`, data)
        .then((response) => {
          if (response.status === 200) {
              return response.data
          }
      })
      .catch(error => {
        return error.response.data.errors[0]
      })
      },
      updateItem (id, data) {
        return Service.post(`${resource}/${id}`, data, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      }).then((response) => {
          if (response.status === 200) {
              return response.data
          }
      })
      .catch(error => {
        return error.response.data.errors[0]
      })
      },
      deleteItems (ids, password) {
        const data = {
          ids: ids,
          password: password,
        }
        return Service.delete(`${resource}/delete`, { data })
        .then((response) => {
          if (response.status === 200) {
              return response.data
          }
      })
      .catch(error => {
        return error.response.data.errors[0]
      })
      },
}
