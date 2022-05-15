import companies from './CompanyStructure/companies'
import department from './CompanyStructure/department'
import jobTitle from './CompanyStructure/jobTittle'
import categories from './CompanyStructure/categories'
import city from './Location/city'
import area from './Location/area'

const services = {
  companies: companies,
  department: department,
  jobTitle: jobTitle,
  categories: categories,
  city: city,
  area: area,
}

export const ServiceFactory = {
    get: name => services[name],
}
