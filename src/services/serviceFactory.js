import companies from './CompanyStructure/companies'
import department from './CompanyStructure/department'
import jobTitle from './CompanyStructure/jobTittle'
import categories from './CompanyStructure/categories'
import users from './CompanyStructure/users'
import city from './Location/city'
import area from './Location/area'
import news from './HRSpace/news'
import policies from './policies/policies'
import faqs from './faqs/faqs'
import missions from './Reports/Mission'
import roles from './Administrator/roles'
import times from './Administrator/Time'
import execuses from './Reports/execuses'
import reportingTo from './Reports/ReportingTo'
import attendances from './Reports/Signin-out'
import vacation from './Reports/vacation'
import MainReport from './Reports/MainReport'
import top_management_users from './Reports/topmanagement'
import permissions from './Administrator/permissions'
import home from './home/home'
import hrWorkerPlanner from './Reports/ERPReports.js'
import absenceSheetTransaction from './Reports/absenceSheetTransaction'
import hrTimeAttendance from './Reports/hrTimeAttendance'
// import penaltyReport from './Reports/penaltyReport'
import signInOut from './Reports/allReport'
import sammry from './Reports/sammry'
import penaltyReport from './Reports/bnalty'
import absence from './Reports/absenceRebort'

const services = {
  companies: companies,
  department: department,
  jobTitle: jobTitle,
  categories: categories,
  users: users,
  city: city,
  area: area,
  news : news,
  policies: policies,
  faqs: faqs,
  missions : missions,
  roles : roles,
  times : times,
  execuses:execuses,
  reportingTo : reportingTo,
  attendances : attendances,
  vacation :vacation,
  MainReport: MainReport,
  top_management_users: top_management_users,
  permissions: permissions,
  home: home,
  hrWorkerPlanner: hrWorkerPlanner,
  absenceSheetTransaction: absenceSheetTransaction,
  hrTimeAttendance: hrTimeAttendance,
  // penaltyReport: penaltyReport,
  signInOut: signInOut,
  sammry: sammry,
  penaltyReport: penaltyReport,
  absence: absence
}

export const ServiceFactory = {
    get: name => services[name],
}
