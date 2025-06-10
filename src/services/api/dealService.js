import { toast } from 'react-toastify';

const dealService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // For fetching, we can use all fields regardless of visibility
      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "value", "stage", "company_id", "contact_ids", "notes", "created_at", "updated_at", "closed_at"]
      };

      const response = await apperClient.fetchRecords('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "value", "stage", "company_id", "contact_ids", "notes", "created_at", "updated_at", "closed_at"]
      };

      const response = await apperClient.getRecordById('deal', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const updateableData = {
        Name: dealData.name || dealData.Name,
        Tags: dealData.tags || dealData.Tags || "",
        Owner: dealData.owner || dealData.Owner,
        title: dealData.title,
        value: parseInt(dealData.value) || 0,
        stage: dealData.stage || "lead",
        company_id: dealData.companyId ? parseInt(dealData.companyId) : null,
        contact_ids: Array.isArray(dealData.contactIds) ? dealData.contactIds.join(',') : (dealData.contact_ids || ""),
        notes: dealData.notes || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        closed_at: (dealData.stage === 'closed-won' || dealData.stage === 'closed-lost') ? new Date().toISOString() : null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update operation
      const updateableData = {
        Id: parseInt(id),
        Name: updateData.name || updateData.Name,
        Tags: updateData.tags || updateData.Tags || "",
        Owner: updateData.owner || updateData.Owner,
        title: updateData.title,
        value: parseInt(updateData.value) || 0,
        stage: updateData.stage,
        company_id: updateData.companyId ? parseInt(updateData.companyId) : null,
        contact_ids: Array.isArray(updateData.contactIds) ? updateData.contactIds.join(',') : (updateData.contact_ids || ""),
        notes: updateData.notes || "",
        updated_at: new Date().toISOString(),
        closed_at: (updateData.stage === 'closed-won' || updateData.stage === 'closed-lost') ? new Date().toISOString() : updateData.closed_at
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
};

export default dealService;