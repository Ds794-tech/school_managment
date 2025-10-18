import Swal from 'sweetalert2';

const showSuccess = async (title, text) => {
  return Swal.fire({
    position: 'center',
    icon: 'success',
    title: title || 'Success!',
    text: text || 'Operation completed successfully.',
    showConfirmButton: true,
    confirmButtonColor: '#2563eb',
  });
};

const showError = async (title, text) => {
  return Swal.fire({
    position: 'center',
    icon: 'error',
    title: title || 'Error!',
    text: text || 'An error occurred. Please try again.',
    confirmButtonColor: '#dc2626',
  });
};

const showConfirm = async (title, text, confirmButtonText = 'Yes') => {
  return Swal.fire({
    title: title || 'Are you sure?',
    text: text || "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Cancel'
  });
};

export { showSuccess, showError, showConfirm };
