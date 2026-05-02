import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import * as Icons from 'lucide-react';
const ServiceManager = () => {
  const { pricingServices, addService, updateService, deleteService } =
    useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialFormState = {
    title: '',
    desc: '',
    priceIN: '',
    priceUS: '',
    iconName: 'Code',
    iconColor: '#6366f1',
    features: '',
    popular: false,
  };
  const [formData, setFormData] = useState(initialFormState);
  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        ...service,
        features: service.features.join(', '),
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormState);
    setEditingId(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      features: formData.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f !== ''),
    };
    if (editingId) {
      updateService(editingId, serviceData);
    } else {
      addService(serviceData);
    }
    handleCloseModal();
  };
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };
  const renderIcon = (name, color) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent size={20} color={color} />;
  };
  return (
    <div
      className="animate-fade-in"
      style={{
        paddingBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '2rem',
              marginBottom: '0.25rem',
            }}
          >
            Service Management
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Add or edit the pricing plans displayed on your main page.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      <div
        className="stat-card"
        style={{
          padding: '0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr
                style={{
                  color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                <th
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontWeight: '600',
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontWeight: '600',
                  }}
                >
                  Price (INR)
                </th>
                <th
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontWeight: '600',
                  }}
                >
                  Price (USD)
                </th>
                <th
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontWeight: '600',
                  }}
                >
                  Features
                </th>
                <th
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontWeight: '600',
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingServices.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    No services found. Add one to display it on the landing
                    page.
                  </td>
                </tr>
              ) : (
                pricingServices.map((service, idx) => (
                  <tr
                    key={service.id}
                    style={{
                      borderBottom:
                        idx !== pricingServices.length - 1
                          ? '1px solid var(--glass-border)'
                          : 'none',
                    }}
                  >
                    <td
                      style={{
                        padding: '1.25rem 1.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                        }}
                      >
                        <div
                          style={{
                            padding: '0.5rem',
                            background: 'var(--bg-color)',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                          }}
                        >
                          {renderIcon(service.iconName, service.iconColor)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            {service.title}
                            {service.popular && (
                              <Star
                                size={12}
                                fill="var(--warning)"
                                color="var(--warning)"
                              />
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              marginTop: '0.2rem',
                            }}
                          >
                            {service.desc}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '1.25rem 1.5rem',
                        fontWeight: '600',
                      }}
                    >
                      ₹{service.priceIN}
                    </td>
                    <td
                      style={{
                        padding: '1.25rem 1.5rem',
                        fontWeight: '600',
                      }}
                    >
                      ${service.priceUS}
                    </td>
                    <td
                      style={{
                        padding: '1.25rem 1.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {service.features.length} features
                    </td>
                    <td
                      style={{
                        padding: '1.25rem 1.5rem',
                        textAlign: 'right',
                      }}
                    >
                      <button
                        onClick={() => handleOpenModal(service)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--primary-color)',
                          cursor: 'pointer',
                          marginRight: '1rem',
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="glass-panel animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '600px',
              background: 'var(--bg-secondary)',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                }}
              >
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    required
                    className="chat-input"
                    style={{
                      width: '100%',
                      background: 'var(--bg-color)',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Lucide Icon Name (e.g. Rocket)
                  </label>
                  <input
                    type="text"
                    value={formData.iconName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iconName: e.target.value,
                      })
                    }
                    required
                    className="chat-input"
                    style={{
                      width: '100%',
                      background: 'var(--bg-color)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc: e.target.value,
                    })
                  }
                  required
                  className="chat-input"
                  style={{
                    width: '100%',
                    background: 'var(--bg-color)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Price INR (e.g. 15,000)
                  </label>
                  <input
                    type="text"
                    value={formData.priceIN}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceIN: e.target.value,
                      })
                    }
                    required
                    className="chat-input"
                    style={{
                      width: '100%',
                      background: 'var(--bg-color)',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Price USD (e.g. 499)
                  </label>
                  <input
                    type="text"
                    value={formData.priceUS}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceUS: e.target.value,
                      })
                    }
                    required
                    className="chat-input"
                    style={{
                      width: '100%',
                      background: 'var(--bg-color)',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Icon Color (Hex/Var)
                  </label>
                  <input
                    type="text"
                    value={formData.iconColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iconColor: e.target.value,
                      })
                    }
                    required
                    className="chat-input"
                    style={{
                      width: '100%',
                      background: 'var(--bg-color)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Features (comma separated)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value,
                    })
                  }
                  required
                  className="chat-input"
                  rows="3"
                  style={{
                    width: '100%',
                    background: 'var(--bg-color)',
                    resize: 'vertical',
                  }}
                  placeholder="Custom Design, SEO, Fast Delivery"
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={formData.popular}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      popular: e.target.checked,
                    })
                  }
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />
                <label
                  htmlFor="popularCheck"
                  style={{
                    fontSize: '0.9rem',
                  }}
                >
                  Mark as "Most Popular" plan
                </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                  }}
                >
                  {editingId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ServiceManager;
