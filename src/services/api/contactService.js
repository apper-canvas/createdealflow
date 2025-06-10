import { toast } from 'react-toastify';

const contactService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // For fetching, we can use all fields regardless of visibility
      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "first_name", "last_name", "email", "phone", "role", "created_at", "updated_at", "company_id", "FirstName", "LastName", "Email", "Phone", "Label", "Enabled", "SendAccountEmail", "SendBillingEmail", "AccountId"]
      };

      const response = await apperClient.fetchRecords('contact', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "first_name", "last_name", "email", "phone", "role", "created_at", "updated_at", "company_id", "FirstName", "LastName", "Email", "Phone", "Label", "Enabled", "SendAccountEmail", "SendBillingEmail", "AccountId"]
      };

      const response = await apperClient.getRecordById('contact', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const updateableData = {
        Name: contactData.name || contactData.Name,
        Tags: contactData.tags || contactData.Tags || "",
        Owner: contactData.owner || contactData.Owner,
        first_name: contactData.firstName || contactData.first_name,
        last_name: contactData.lastName || contactData.last_name,
        email: contactData.email,
        phone: contactData.phone,
        role: contactData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company_id: contactData.companyId ? parseInt(contactData.companyId) : null,
        FirstName: contactData.firstName || contactData.FirstName,
        LastName: contactData.lastName || contactData.LastName,
        Email: contactData.email || contactData.Email,
        Phone: contactData.phone || contactData.Phone,
        Label: contactData.label || contactData.Label,
        Enabled: contactData.enabled !== undefined ? contactData.enabled : true,
        SendAccountEmail: contactData.sendAccountEmail !== undefined ? contactData.sendAccountEmail : false,
        SendBillingEmail: contactData.sendBillingEmail !== undefined ? contactData.sendBillingEmail : false,
        AccountId: contactData.accountId ? parseInt(contactData.accountId) : null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('contact', params);

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
      console.error("Error creating contact:", error);
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
        first_name: updateData.firstName || updateData.first_name,
        last_name: updateData.lastName || updateData.last_name,
        email: updateData.email,
        phone: updateData.phone,
        role: updateData.role,
        updated_at: new Date().toISOString(),
        company_id: updateData.companyId ? parseInt(updateData.companyId) : null,
        FirstName: updateData.firstName || updateData.FirstName,
        LastName: updateData.lastName || updateData.LastName,
        Email: updateData.email || updateData.Email,
        Phone: updateData.phone || updateData.Phone,
        Label: updateData.label || updateData.Label,
        Enabled: updateData.enabled !== undefined ? updateData.enabled : true,
        SendAccountEmail: updateData.sendAccountEmail !== undefined ? updateData.sendAccountEmail : false,
        SendBillingEmail: updateData.sendBillingEmail !== undefined ? updateData.sendBillingEmail : false,
        AccountId: updateData.accountId ? parseInt(updateData.accountId) : null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('contact', params);

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
      console.error("Error updating contact:", error);
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

      const response = await apperClient.deleteRecord('contact', params);

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
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};

export default contactService;