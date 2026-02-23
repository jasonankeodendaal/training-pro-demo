import React, { useState } from 'react';

export default function FooterSettings() {
  const [copyright, setCopyright] = useState('TrainingPro. All rights reserved.');
  const [facebook, setFacebook] = useState('https://facebook.com');
  const [twitter, setTwitter] = useState('https://twitter.com');
  const [instagram, setInstagram] = useState('https://instagram.com');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Footer Settings</h2>
      <div>
        <label htmlFor="copyright" className="block text-sm font-medium text-slate-700">Copyright Text</label>
        <input type="text" id="copyright" value={copyright} onChange={(e) => setCopyright(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
      </div>
      <div>
        <h3 className="text-lg font-medium">Social Links</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-slate-700">Facebook</label>
            <input type="text" id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-slate-700">Twitter</label>
            <input type="text" id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-slate-700">Instagram</label>
            <input type="text" id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700">LinkedIn</label>
            <input type="text" id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

