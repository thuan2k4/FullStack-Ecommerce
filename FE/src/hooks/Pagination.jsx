import { useState } from 'react'

const usePagination = (itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const previousPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
    }

    const nextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
    }

    return {
        currentPage,
        totalPages,
        setTotalPages,
        paginate,
        previousPage,
        nextPage,
        itemsPerPage
    }
}
export default usePagination