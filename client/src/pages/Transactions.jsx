import DashboardLayout from "../layouts/DashboardLayout";
import AddTransactionModal from "../components/common/AddTransactionModal";
import Toast from "../components/common/Toast";

import TransactionsHeader from "../components/transactions/TransactionsHeader";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import Pagination from "../components/transactions/Pagination";
import BulkDeleteBar from "../components/transactions/BulkDeleteBar";

import useDebounce from "../hooks/useDebounce";
import useTransactions from "../hooks/useTransactions";
import useSortedTransactions from "../hooks/useSortedTransactions";
import useTransactionModal from "../hooks/useTransactionModal";
import { useState, useRef, useCallback, useEffect } from "react";

export default function Transactions() {
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search and filters
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  // Row dropdown menu
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const triggerToast = useCallback((message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  }, []);

  // Debounced search
  const debouncedKeyword = useDebounce(keyword, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  // Fetch, delete, bulk delete, selection logic
  const {
    transactions,
    loading,
    totalCount,
    totalPages,
    selectedIds,
    setSelectedIds,
    handleSelectOne,
    fetchTransactions,
    handleDeleteOne,
    handleBulkDelete,
  } = useTransactions({
    page,
    pageSize,
    debouncedKeyword,
    typeFilter,
    recurringFilter,
    setPage,
    triggerToast,
  });

  // Sorting logic
  const { sortedTransactions, handleSort } =
    useSortedTransactions(transactions);

  // Create/edit modal logic
  const {
    isModalOpen,
    modalMode,
    initialData,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useTransactionModal();

  // Close row dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 flex flex-col gap-8 text-left animate-fadeIn">
        <TransactionsHeader onAddTransaction={openCreateModal} />

        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/50 backdrop-blur-sm overflow-hidden">
          <TransactionFilters
            keyword={keyword}
            setKeyword={setKeyword}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            recurringFilter={recurringFilter}
            setRecurringFilter={setRecurringFilter}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPage={setPage}
          />

          <TransactionTable
            transactions={sortedTransactions}
            loading={loading}
            selectedIds={selectedIds}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            menuRef={menuRef}
            onSelect={handleSelectOne}
            onEdit={openEditModal}
            onDelete={handleDeleteOne}
            onSort={handleSort}
          />

          {!loading && transactions.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <BulkDeleteBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDeleteSelected={handleBulkDelete}
      />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          fetchTransactions();

          triggerToast(
            modalMode === "edit"
              ? "Transaction updated successfully"
              : "Transaction created successfully"
          );
        }}
        mode={modalMode}
        initialData={modalMode === "edit" ? initialData : null}
        showReceiptScan={false}
      />

      <Toast
        show={showToast}
        type={toastType}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </DashboardLayout>
  );
}