import { useState } from 'react';
import classes from './profile-form.module.css';

function ProfileForm() {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [info, setInfo] = useState(null);
  const updatePassword = async (e) => {
    e.preventDefault();
    setInfo(null);

    if (!oldPwd || !newPwd || newPwd.trim().length < 7) {
      setInfo('New password must be at least 7 chars long!');
      return;
    }

    try {
      const res = await fetch(`/api/user/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: oldPwd,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'You typed incorrect password!');
      }

      setInfo(data.message || 'Success!');
      setOldPwd('');
      setNewPwd('');
    } catch (err) {
      setInfo(err.message || 'Something went wrong!');
    }
  };

  return (
    <form className={classes.form} onSubmit={updatePassword}>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input
          type='password'
          id='old-password'
          value={oldPwd}
          onChange={(e) => setOldPwd(e.target.value)}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
        />
      </div>
      {info && <p style={{ textAlign: 'center' }}>{info}</p>}
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
