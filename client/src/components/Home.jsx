import React, { useState } from 'react';
import Loading from './Loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = ({ setResult }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: [{ name: '', position: '' }],
    skills: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const newFormData = new FormData();
    newFormData.append('name', formData.name);
    newFormData.append('email', formData.email);
    newFormData.append('phone', formData.phone);
    newFormData.append('address', formData.address);
    newFormData.append('education', formData.education);
    newFormData.append('skills', formData.skills);
    newFormData.append('headshotImage', formData.image); // Ensure this matches the multer field name
    newFormData.append('experience', JSON.stringify(formData.experience));

    axios
      .post('http://localhost:4000/resume/create', newFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
         
          console.log(res.data.data);
          setResult(res.data.data);
          setLoading(false);
          navigate('/resume');
        
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleUpdateCompany = (e, index) => {
    const { name, value } = e.target;
    const list = [...formData.experience];
    list[index][name] = value;
    setFormData({ ...formData, experience: list });
  };

  const handleAddCompany = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { name: '', position: '' }],
    });
  };

  const handleRemoveCompany = (index) => {
    const list = [...formData.experience];
    list.splice(index, 1);
    setFormData({ ...formData, experience: list });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Resume Builder with AI</h1>
      <form onSubmit={handleSubmit} method='POST' encType='multipart/form-data'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
            Full Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='name'
            placeholder='Enter Full Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
            Email
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='email'
            placeholder='Enter Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>
            Phone
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='phone'
            placeholder='Enter contact detail'
            type='text'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='address'>
            Address
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='address'
            placeholder='Enter State and City '
            type='text'
            name='address'
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='education'>
            Education
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='education'
            placeholder='Enter Education'
            name='education'
            value={formData.education}
            onChange={handleChange}
            required
          />
        </div>

        {formData.experience.map((company, index) => (
          <div key={index}>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={`companyName-${index}`}>
                Company Name
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id={`companyName-${index}`}
                placeholder='Enter Company Name'
                type='text'
                name='name'
                value={company.name}
                onChange={(e) => handleUpdateCompany(e, index)}
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={`position-${index}`}>
                Position Held
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id={`position-${index}`}
                placeholder='Enter Position'
                type='text'
                name='position'
                value={company.position}
                onChange={(e) => handleUpdateCompany(e, index)}
                required
              />
            </div>
            <div className='flex items-center'>
              {formData.experience.length - 1 === index && formData.experience.length < 4 && (
                <button
                  className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
                  type='button'
                  onClick={handleAddCompany}
                >
                  Add
                </button>
              )}
              {formData.experience.length > 1 && (
                <button
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='button'
                  onClick={() => handleRemoveCompany(index)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='skills'>
            Skills
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='skills'
            placeholder='Enter Skills'
            name='skills'
            value={formData.skills}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='image'>
            Profile Image
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='image'
            name='headshotImage' // Ensure this matches the multer field name
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            required
          />
        </div>

        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Create Resume
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
