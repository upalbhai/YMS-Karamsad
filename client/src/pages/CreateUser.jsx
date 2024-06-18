import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Select, TextInput, FileInput, Button, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { app } from '../firebase';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { Country, State } from 'country-state-city';

export default function CreateUser() {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        country: 'India', // Defaulting to India
        state: 'Gujarat',
        isOutsideIndia: false,  // State will be selected based on country
    });
    const [countryCode, setCountryCode] = useState('IN');
    const [isOutsideIndia, setIsOutsideIndia] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [country, setCountry] = useState("India");
    const [state, setState] = useState("Gujarat");
    const navigate = useNavigate();
    const bloodGroups = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
    ];
    const handleCountryChange = (value) => {
        const selectedCountry = Country.getCountryByCode(value);
        setCountry(selectedCountry.name);
        setCountryCode(selectedCountry.isoCode);
        setFormData({ ...formData, country: selectedCountry.name, state: '' }); // Reset state when country changes
        setState(''); // Reset state input when country changes
    };

    const handleStateChange = (value) => {
        setState(value);
        setFormData({ ...formData, state: value });
    };
    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData({
          ...formData,
          isOutsideIndia: value === 'true', // Convert value to boolean
        });
      };
    const handleSelectChange = (e) => {
        setFormData({ ...formData, bloodGroup: e.target.value });
    };

    const handleUploadImage = async () => {
        try {
            if (!file) {
                return toast.error('No file selected');
            }
            if (file.length > 1) {
                return toast.error('Only one file can be uploaded');
            }
            const storage = getStorage(app);
            const fileName = `${new Date().getTime()}-${file.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadProgress(null);
                    toast.error('Something went wrong during the upload');
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            toast.error('Image upload failed');
            setImageUploadProgress(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/post/createpost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                return toast.error(data.message);
            }
            toast.success('Yuvak registered successfully');
            navigate(`/sign-up`);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center my-7 text-3xl font-semibold'>Registered As Yuvak</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex justify-between'>
                    <TextInput type='text' placeholder='Name' required id='name' className='' onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className='lg:flex justify-between'>
                    <div className=''>
                        <span className='flex items-center gap-2'>Enter Phone or <FaWhatsapp className='h-5 w-5' /> Number</span>
                        <PhoneInput
                            country="in"
                            countryCodeEditable={false}
                            placeholder="Phone number"
                            required
                            id="pNumber"
                            className="my-2 text-gray-700"
                            value={formData.pNumber}
                            onChange={(value, country) => setFormData({ ...formData, pNumber: value, country: country.name })}
                        />
                    </div>
                    <div>
                        <span className='flex items-center gap-2'>Enter phone or <FaWhatsapp className='h-5 w-5' /> number of your parent </span>
                        <PhoneInput
                            country='in'
                            placeholder='Phone number'
                            className="my-2 text-gray-700"
                            required
                            id='parentNumber'
                            value={formData.parentNumber}
                            onChange={(value) => setFormData({ ...formData, parentNumber: value })}
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <Textarea type='text' placeholder='Address' required id='address' className='' onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <TextInput type='text' placeholder='Education' required id='education' className='flex-1 my-3' onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                    <TextInput type='number' placeholder='Age' required id='age' className='flex-1 my-3' onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                    <Select id="bloodGroup" required onChange={handleSelectChange}>
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((bg) => (
                            <option key={bg.value} value={bg.value}>
                                {bg.label}
                            </option>
                        ))}
                    </Select>
                    <TextInput type='email' placeholder='Enter a valid Email' required id='email' className='flex-1 my-3' onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <TextInput type='date' placeholder='Enter a valid date' required id='birthDate' className='flex-1 my-3' onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} />
                </div>
                <div>
        

        
                <div className='lg:flex justify-between'>
                    <div className=''>
                        <div>
                        <label htmlFor="country">Country</label>
                        </div>
                    
                    <select className='border rounded-lg w-80 text-black'
                        name="country"
                        id="country"
                        value={countryCode}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        required
                    >
                        <option className='' value="">Select Country</option>
                        {Country.getAllCountries().map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    </div>
                    {countryCode && (
                        <div >
                            <div>
                            <label htmlFor="state">State</label>

                            </div>
                            <select className='rounded-lg w-80 text-black'
                                name="state"
                                id="state"
                                value={state}
                                onChange={(e) => handleStateChange(e.target.value)}
                                required
                            >
                                <option value="">Select State</option>
                                {State.getStatesOfCountry(countryCode).map((state) => (
                                    <option key={state.isoCode} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
           
        </div>

                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button type='button' className='dark:bg-custom-orange' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {formData.image && <img src={formData.image} alt='Uploaded' className='w-full h-72 object-cover' />}
                <Button type='submit' className='bg-custom-btn'>
                    Publish
                </Button>
            </form>
        </div>
    );
}
