import React from 'react';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tulis konten di sini...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-slate-600 rounded-md bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
        rows={8}
      />
      <div className="mt-2 text-xs text-slate-400">
        <p>Tips: Gunakan HTML tags untuk formatting:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>&lt;strong&gt; untuk <strong>teks tebal</strong></li>
          <li>&lt;em&gt; untuk <em>teks miring</em></li>
          <li>&lt;ul&gt; dan &lt;li&gt; untuk daftar</li>
          <li>&lt;br&gt; untuk baris baru</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleRichTextEditor; 