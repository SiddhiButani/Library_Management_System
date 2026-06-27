export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toFixed(2)}`;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    issued: 'blue',
    returned: 'green',
    overdue: 'red',
    rejected: 'gray',
    waiting: 'purple',
    notified: 'cyan',
    cancelled: 'gray',
    fulfilled: 'green',
    paid: 'green',
    waived: 'purple',
    active: 'green',
    inactive: 'red',
    unread: 'orange',
    read: 'blue',
    replied: 'green',
    basic: 'blue',
    premium: 'purple',
    gold: 'orange',
    none: 'gray'
  };
  return colors[status] || 'gray';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
};

export const daysUntil = (date) => {
  if (!date) return 0;
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};
