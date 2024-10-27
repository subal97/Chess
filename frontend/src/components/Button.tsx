
export const Button = ({ onClick, customStyle, children } : { onClick: () => void, customStyle?: string, children: React.ReactNode} ) => {
    customStyle ??= "";
    return <button onClick={onClick}
        className={`bg-orange-400 hover:bg-green-500 rounded text-white font-bold text-xl  ${customStyle}`}>
            {children}
    </button>
}