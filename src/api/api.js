import api from './axios';
import {toast} from 'sonner';

class ApiService {
    constructor(apiInstance) {
        this.api = apiInstance;
    }

}
const apiService = ApiService()
export default apiService;