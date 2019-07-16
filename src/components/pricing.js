import React, { useEffect, useReducer } from "react"
import pricingStyles from "../styles/pricing.module.scss"
import dietDetails from "../data/companyDetails/dietDetails"
import cateringDetails from "../data/companyDetails/cateringDetails"

const Pricing = React.forwardRef((props, ref) => {
  const initialState = {
    activeDiet: "",
    activeOption: "",
    activeCalories: "",
  }
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "STORE_DIET":
        return {
          ...state,
          activeDiet: action.activeDiet,
        }
      case "STORE_OPTION":
        return {
          ...state,
          activeOption: action.activeOption,
        }
      case "STORE_CALORIES":
        return {
          ...state,
          activeCalories: action.activeCalories,
        }
      default:
        return state
    }
  }, initialState)
  useEffect(() => {
    dispatch({ type: "STORE_DIET", activeDiet: getDiets()[0] })
  }, [])
  useEffect(() => {
    state.activeDiet &&
      dispatch({ type: "STORE_OPTION", activeOption: getDietOptions()[0] })
  }, [state.activeDiet])
  useEffect(() => {
    state.activeOption &&
      dispatch({
        type: "STORE_CALORIES",
        activeCalories: getDietOptionCalories()[0],
      })
  }, [state.activeOption])

  const getDiets = () => {
    return cateringDetails.diets
      .reduce((acc, curr) => {
        const dietAlreadyExists = acc.findIndex(
          diet => diet.dietId === curr.dietId
        )
        if (dietAlreadyExists === -1) {
          acc.push({
            diet: curr.dietName,
            dietId: curr.dietId,
          })
        }
        return acc
      }, [])
      .sort((prev, next) => prev.diet.localeCompare(next.diet))
  }

  const getDietOptions = () => {
    const { activeDiet } = state
    const selectedDiet = activeDiet.dietId
    const filteredDiet = cateringDetails.diets.filter(
      diet => diet.dietId === selectedDiet
    )
    return (
      filteredDiet &&
      filteredDiet
        .reduce((acc, curr) => {
          const optionAlreadyExists = acc.findIndex(
            option => option.optionId === curr.dietOptionId
          )
          if (optionAlreadyExists === -1) {
            acc.push({
              option: curr.dietOptionName,
              optionId: curr.dietOptionId,
            })
          }
          return acc
        }, [])
        .sort((prev, next) => prev.option.localeCompare(next.option))
    )
  }

  const getDietOptionCalories = () => {
    const { activeOption } = state
    const selectedOption = activeOption.optionId
    const filteredDietOption = cateringDetails.diets.filter(
      diet => diet.dietOptionId === selectedOption
    )

    return (
      filteredDietOption &&
      filteredDietOption
        .reduce((acc, curr) => {
          const caloriesAlreadyExists = acc.findIndex(
            dietOption => dietOption.calories === curr.calories
          )

          if (caloriesAlreadyExists === -1) {
            acc.push({
              calories: curr.calories,
              dietCaloriesId: curr.dietCaloriesId,
            })
          }
          return acc
        }, [])
        .sort((prev, next) => prev.calories - next.calories)
    )
  }

  return (
    <div ref={ref}>
      <h2>Cennik naszych diet pudełkowych</h2>
      <div className={pricingStyles.container}>
        <div className={pricingStyles.leftSide}>
          <div className={pricingStyles.leftSideWrapper}>
            <div className={pricingStyles.section}>
              <p>Dieta</p>
              {getDiets().map(item => (
                <div
                  onClick={() =>
                    dispatch({ type: "STORE_DIET", activeDiet: item })
                  }
                  key={item.dietId}
                  className={
                    item.dietId === state.activeDiet.dietId
                      ? pricingStyles.activeItem
                      : pricingStyles.item
                  }
                >
                  {item.diet}
                </div>
              ))}
            </div>
            <div className={pricingStyles.section}>
              <p>Kaloryczność</p>
              {getDietOptionCalories().map(item => (
                <div
                  onClick={() => dispatch({
                    type: "STORE_CALORIES",
                    activeCalories: item,
                  })}
                  key={item.dietCaloriesId}
                  className={
                    item.dietCaloriesId === state.activeCalories.dietCaloriesId
                      ? pricingStyles.activeItem
                      : pricingStyles.item
                  }
                >
                  {item.calories} kcal
                </div>
              ))}
            </div>
            <div className={pricingStyles.section}>
              <p>Posiłki</p>
              <div className={pricingStyles.mealItem}>Śniadanie</div>
              <div className={pricingStyles.mealItem}>II Śniadanie</div>
              <div className={pricingStyles.mealItem}>Obiad</div>
              <div className={pricingStyles.mealItem}>Podwieczorek</div>
              <div className={pricingStyles.mealItem}>Kolacja</div>
            </div>
            <div className={pricingStyles.daysSection}>
              <p>Okres zamówienia</p>
              <div className={pricingStyles.dayButton}>-</div>
              <div className={pricingStyles.dayInput}>
                <span>2 </span>
                <input />
                dni
              </div>
              <div className={pricingStyles.dayButton}>+</div>
            </div>
            <div className={pricingStyles.barSection}>
              <div>
                <p>Dodaj 2 dni, aby uzyskać 5% rabatu</p>
              </div>
              <div className={pricingStyles.barItem}>
                <div style={{ width: "200px" }} />
              </div>
              <div>
                <p>RABAT: 0</p>
              </div>
            </div>
          </div>
        </div>
        <div className={pricingStyles.rightSide}>
          <div className={pricingStyles.rightSideWrapper}>
            <p>CENA DIETY</p>
            <h2>43 PLN / DZIEN</h2>
            <p className={pricingStyles.priceSummary}>
              RAZEM: 516 PLN za 12 dni
            </p>
            <button>Zamów</button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Pricing
