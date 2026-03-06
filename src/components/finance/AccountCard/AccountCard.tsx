import type { Account } from "../../../features/accounts/types"
import Button from "../../ui/Button/Button"
import styles from "./AccountCard.module.css"

type Props = {
  account: Account
  onEdit?: (a: Account) => void
  onDelete?: (id: string) => void
}

function formatLast4(last4?: string | null) {
  if (!last4) return "****"
  return last4
}

export default function AccountCard({ account, onEdit, onDelete }: Props) {

  const isBill = account.type === "CASH" || account.type === "SAVINGS"
  const isCard = account.type === "DEBIT" || account.type === "CREDIT_CARD"

  /* =========================
     BILLETE
  ========================= */

  if (isBill) {

    const accountType =
      account.type === "SAVINGS" ? "AHORRO" : "EFECTIVO"

    const billVariant =
      account.type === "SAVINGS"
        ? styles.savings
        : styles.cash

    return (
      <div className={`${styles.shell} ${styles.bill} ${billVariant}`}>

        <div className={styles.billTop}>

          <div className={styles.billTitleWrap}>
            <div className={styles.billTitle}>
              {account.name || "Banco"}
            </div>
          </div>

          <div className={styles.billMark}>
            <span className={styles.billSymbol}>$</span>
          </div>

        </div>

        <div></div>
        <div></div>

        <div className={styles.billBottom}>

          <div></div>
          <div></div>

          <span className={styles.billCode}>
            {accountType}
          </span>

        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => onEdit?.(account)}>
            Editar
          </Button>

          <Button variant="ghost" onClick={() => onDelete?.(account.id)}>
            Eliminar
          </Button>
        </div>

      </div>
    )
  }

  /* =========================
     TARJETA
  ========================= */

  if (isCard) {

    const brand =
      account.type === "CREDIT_CARD"
        ? "CRÉDITO"
        : "DÉBITO"

    const cardVariant =
      account.type === "CREDIT_CARD"
        ? styles.credit
        : styles.debit

    return (
      <div className={`${styles.shell} ${styles.card} ${cardVariant}`}>

        <div className={styles.cardTop}>
          <span className={styles.cardBank}>
            {account.bank || "Banco"}
          </span>

          <div className={styles.chip}/>
        </div>

        <div className={styles.cardNumber}>
          **** **** **** {formatLast4(account.last4)}
        </div>

        <div className={styles.cardBottom}>

          <div className={styles.cardName}>
            <div className={styles.cardTitle}>
              {account.name}
            </div>
          </div>

          <span className={styles.billCode}>
            {brand}
          </span>

        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => onEdit?.(account)}>
            Editar
          </Button>

          <Button variant="ghost" onClick={() => onDelete?.(account.id)}>
            Eliminar
          </Button>
        </div>

      </div>
    )
  }

  /* =========================
     FALLBACK
  ========================= */

  return (
    <div className={styles.shell}>

      <div className={styles.fallback}>
        <strong>{account.name}</strong>
        <span className={styles.muted}>
          {account.type}
        </span>
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => onEdit?.(account)}>
          Editar
        </Button>

        <Button variant="ghost" onClick={() => onDelete?.(account.id)}>
          Eliminar
        </Button>
      </div>

    </div>
  )
}