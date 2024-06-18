import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Country, State } from 'country-state-city';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput,FileInput, Textarea, Select, Button } from 'flowbite-react'; // Assuming these are imported from your UI library
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';

export default function UpdateUser() {
    const { currentUser } = useSelector((state) => state.user);
    const { postId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        country: '', // Initialize country and state in formData
        state: '',
    });
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);

    const [countryCode, setCountryCode] = useState('IN'); // Default to India
    const [isOutsideIndia, setIsOutsideIndia] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    return toast.error(data.message);
                }
                if (res.ok && data.posts.length > 0) {
                    setFormData(data.posts[0]);
                    // Assuming you have country and state set in formData from backend
                    setCountryCode(data.posts[0].countryCode);
                    setIsOutsideIndia(data.posts[0].isOutsideIndia);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchPost();
    }, [postId]);

    const handleCountryChange = (value) => {
        const selectedCountry = Country.getCountryByCode(value);
        setCountryCode(selectedCountry.isoCode);
        setFormData({ ...formData, country: selectedCountry.name, state: '' });
    };
    const handleSelectChange = (e) => {
        setFormData({ ...formData, bloodGroup: e.target.value });
    };
    const handleStateChange = (value) => {
        const selectedState = State.getStatesOfCountry(countryCode).find((state) => state.name === value);
        if (selectedState) {
            setFormData({ ...formData, state: selectedState.name });
        } else {
            setFormData({ ...formData, state: '' }); // Reset state if no valid state is selected
        }
    };
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
    const handleUploadImage = async () => {
        try {
            if (!file) {
                return toast.error('No file selected');
            }
            if (file.length > 1) {
                return toast.error('Only one file can be uploaded');
            }
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
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
                    toast.error('Something went wrong');
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
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                return toast.error(data.message);
            }
            if (res.ok) {
                toast.success('Post updated successfully');
                navigate(`/yuvak/${data._id}`);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center my-7 text-3xl font-semibold'>Update A Post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className="flex-row gap-4 p-5 justify-between">
                    <TextInput
                        type='text'
                        placeholder='Name'
                        required
                        id='name'
                        className='flex-1 my-5'
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        value={formData.name || ''}
                    />
                    <Textarea
                        type='text'
                        placeholder='Address'
                        required
                        id='address'
                        className='flex-1 my-5'
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        value={formData.address || ''}
                    />
                    <TextInput
                        type='text'
                        placeholder='Education'
                        required
                        id='education'
                        className='flex-1 my-5'
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        value={formData.education || ''}
                    />
                    <div className='lg:flex justify-between'>
                        <div>
                            <span className='flex items-center gap-2'>Enter Phone or <FaWhatsapp className='h-5 w-5' /> Number</span>
                            <PhoneInput
                                country="in"
                                countryCodeEditable={false}
                                placeholder="Phone number"
                                required
                                id="pNumber"
                                className="my-2 text-gray-700"
                                value={formData.pNumber || ''}
                                onChange={(value, country) => setFormData({ ...formData, pNumber: value, country: country.name })}
                            />
                        </div>
                        <div>
                            <span className='flex items-center gap-2'>Enter phone or <FaWhatsapp className='h-5 w-5' /> number of your parent</span>
                            <PhoneInput
                                country='in'
                                placeholder='Phone number'
                                className="my-2 text-gray-700"
                                required
                                id='parentNumber'
                                value={formData.parentNumber || ''}
                                onChange={(value) => setFormData({ ...formData, parentNumber: value })}
                            />
                        </div>
                    </div>
                </div>
                <Select id="bloodGroup" value={formData.bloodGroup || ''} required onChange={handleSelectChange}>
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((bg) => (
                        <option key={bg.value} value={bg.value}>
                            {bg.label}
                        </option>
                    ))}
                </Select>
                <div>
                    
                   
                        <div>
                            <label htmlFor="country">Country</label>
                            <Select
                                name="country"
                                id="country"
                                value={countryCode}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                required
                            >
                                <option value="">Select Country</option>
                                {Country.getAllCountries().map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </Select>
                            {countryCode && (
                                <div>
                                    <label htmlFor="state">State</label>
                                    <Select
                                        name="state"
                                        id="state"
                                        value={formData.state || ''}
                                        onChange={(e) => handleStateChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {State.getStatesOfCountry(countryCode).map((state) => (
                                            <option key={state.isoCode} value={state.name}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            )}
                        </div>
                 
                </div>
                <div>
    <label htmlFor="birthDate">Birth Date</label>
    <input
        type="date"
        id="birthDate"
        value={formData.birthDate || ''}
        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        className="form-input"
        required
    />
</div>


                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 ">
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
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
                {formData.image && <img src={formData.image} alt='image' className='w-full h-72 object-cover' />}
                <Button type='submit' className='bg-custom-btn'>Edit</Button>
            </form>
        </div>
    );
}
