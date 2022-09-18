
import Service from '../services'
import { API_URL } from '../../config/config'

const resource = `${API_URL}/reports/vacation`
export default {
  getAllItems (itemsPerPage, page, pageNumber,keyword ={},list={}) {

    const pageN = (page && page !== '') ? 'page=' + page : ''
    const paginate = (itemsPerPage && itemsPerPage !== '') ? '&paginate=' + itemsPerPage : ''

      const fromDate = (keyword.dateFrom && keyword != '') ? "&from=" + keyword.dateFrom : '';
      const toDate = (keyword.dateTo && keyword != '') ? "&to=" + keyword.dateTo : '';
      const company_id = (list.company_id && list != '') ? "&company_id=" + list.company_id : '';
      const department_id = (list.department_id && list != '') ? "&department_id=" + list.department_id : '';
      const jobtitle_id = (list.jobtitle_id && list != '') ? "&jobtitle_id=" + list.jobtitle_id : '';
      const filterQuery = pageN + paginate  + fromDate + toDate + company_id  + department_id + jobtitle_id
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
